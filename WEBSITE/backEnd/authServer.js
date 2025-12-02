import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'smart_home',
    port: 3307
})

db.connect((err) => {
    if(err){
        console.log('MySQL connection failed: ', err);
    }
    else{
        console.log('Connected to MySQL database successfully');
    }
})

// REGISTER
app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    
    if(!name || !email || !password){
        return res.status(401).json({Message: 'All fields are required'});
    }

    try{
        const checkSql = 'SELECT * FROM users WHERE email = (?)';
        db.query(checkSql, [email], async (err, result) => {
            if(err){
                return res.status(500).json({Message: 'DB error: ', error: err})
            }

            if(result.length > 0){
                return res.status(401).json({Message: 'User already exist'});
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);

                const insertSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

                db.query(insertSql, [name, email, hashedPassword], (err2) => {
                    if(err2){
                        return res.status(500).json({Message: 'DB error: ', error: err2})
                    }

                    res.status(201).json({Message: 'Registration successful'});
                })
            }
        })
    }
    catch(error){
        return res.status(500).json({Message: 'Server error: ', error: error});
    }
})

// LOGIN
app.post('/', (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(401).json({Message: 'All fields are required'});
    }

    try{
        const checkSql = 'SELECT * FROM users WHERE email = (?)';
        db.query(checkSql, [email], async (err, result) => {
            if(err){
                return res.status(500).json({Message: 'DB error: ', error: err});
            }

            if(result.length === 0){
                return res.status(401).json({Message: 'User does not exist'});
            }

            else{
                const user = result[0];
                if(await bcrypt.compare(password, user.password)){
                    const accessToken = generateAccessToken(user);
                    const refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET);

                    const saveTokenSql = 'UPDATE users SET refreshToken = (?) WHERE email = (?)';
                    db.query(saveTokenSql, [refreshToken, user.email], (err2) => {
                        if(err2){
                            return res.status(500).json({Message: 'DB error: ', error: err2});
                        }

                        return res.json({
                                    Message: 'Login successful',
                                    user: {name: user.name,
                                        email: user.email,
                                        user_id: user.user_id},
                                    accessToken,
                                    refreshToken
                                    })
                    })
                }
                else{
                    return res.status(403).json({Message: 'Invalid credentials'});
                }
            }
        })
    }
    catch(error){
        return res.status(500).json({Message: 'Server error: ', error: error})
    }
})

// REFRESH TOKEN
app.post('/token', (req, res) => {
    const refreshToken = req.headers['x-refresh-token'];
    if(!refreshToken){
        return res.status(403).json({Message: 'Token is missing'});
    }

    const checkSql = 'SELECT * FROM users WHERE refreshToken = (?)';
    db.query(checkSql, [refreshToken], (err, result) => {
        if(err){
            return res.status(500).json({Message: 'DB error: ', error: err});
        }

        if(result.length === 0){
            return res.status(403).json({Message: 'Token is missing'});
        }

        const user = result[0];

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err2, decoded) => {
            if(err2){
                return res.status(403).json({Message: 'Invalid token'});
            }

            const accessToken = generateAccessToken(user);
            return res.status(200).json({accessToken});
        })
    })
})

//LOGOUT
app.delete('/logout', (req, res) => {
    const refreshToken = req.headers['x-refresh-token'];
    if(!refreshToken){
        return res.status(403).json({Message: 'Token is missing'});
    }

    const checkSql = 'SELECT * FROM users WHERE refreshToken = (?)';
    db.query(checkSql, [refreshToken], (err, result) => {
        if(err){
            return res.status(500).json({Message: 'DB error: ', error: err});
        }

        if(result.length === 0){
            return res.status(403).json({Message: 'Token is missing'});
        }

        const clearTokenSql = 'UPDATE users SET refreshToken = NULL WHERE refreshToken = (?)';
        db.query(clearTokenSql, [refreshToken], (err2) => {
            if(err2){
                return res.status(500).json({Message: 'DB error: ', error: err2});
            }

            return res.status(200).json({Message: 'Logout successful'});
        })
    })

})

function generateAccessToken(user){
    return jwt.sign({user_id: user.user_id, email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
}

app.listen(4000, () => {
    console.log('AuthServer is running');
})