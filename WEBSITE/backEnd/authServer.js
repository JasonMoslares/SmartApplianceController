import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
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

console.log('Connected to MySQL database successfully');

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).json({ Message: 'All fields required' });
    }

    const [result] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length > 0) {
      return res.status(401).json({ Message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    res.status(201).json({ Message: 'Registration successful' });
  } 
  catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ Message: 'Server error', error: err.message });
  }
});

// LOGIN
app.post('/', async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({Message: 'All fields are required'});
        }

        const [result] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if(result.length === 0){
            return res.status(401).json({Message: 'User does not exist'});
        }

        const user = result[0];
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid){
            return res.status(403).json({Message: 'Invalid credentials'});
        }
        else{
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign({email: user.email}, process.env.REFRESH_TOKEN_SECRET);

            await db.execute('UPDATE users SET refreshToken = ? WHERE email = ?', [refreshToken, user.email]);
            return res.json({Message: 'Login successful',
                        user: {name: user.name,
                        email: user.email,
                        user_id: user.user_id},
                        accessToken,
                        refreshToken
                        })
        }
    }
    catch(err){
        console.error('Login error:', err);
        res.status(500).json({ Message: 'Server error', error: err.message });
    }
})

// REFRESH TOKEN
app.post('/token', async (req, res) => {
    try{
        const refreshToken = req.headers['x-refresh-token'];
        if(!refreshToken){
            return res.status(403).json({Message: 'Token is missing'});
        }

        const [result] = await db.execute('SELECT * FROM users WHERE refreshToken = ?', [refreshToken]);
        if(result.length === 0){
            return res.status(403).json({Message: 'Token is missing'});
        }
        else{
            const user = result[0];

            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(decoded);
                    }
                })  
            })
            const accessToken = generateAccessToken(user);
            return res.status(200).json({ accessToken });
        }
    }
    catch(err){
        console.error('Refresh token error:', err);
        res.status(500).json({ Message: 'Server error', error: err.message });
    }
})

//LOGOUT
app.delete('/logout', async (req, res) => {
    try{
        const refreshToken = req.headers['x-refresh-token'];
        if(!refreshToken){
            return res.status(403).json({Message: 'Token is missing'});
        }

        const [result] = await db.execute('SELECT * FROM users WHERE refreshToken = ?', [refreshToken]);
        if(result.length === 0){
            return res.status(403).json({Message: 'Token is missing'});
        }
        else{
            await db.execute('UPDATE users SET refreshToken = NULL WHERE refreshToken = ?', [refreshToken]);
            return res.status(200).json({Message: 'Logout successful'});
        }
    }
    catch (err) {
        console.log('Logout error:', err);
        return res.status(500).json({ Message: 'Server error', error: err.message })
    }
})

function generateAccessToken(user){
    return jwt.sign({user_id: user.user_id, email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
}

app.listen(4000, () => {
    console.log('AuthServer is running');
})