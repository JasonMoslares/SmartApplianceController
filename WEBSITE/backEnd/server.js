import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

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

// Authenticate and Decode Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        return res.status(401).json({Message: "Access denied. No token provided."})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).json({ Message: "Invalid or expired token" })
        }
        req.user = decoded;
        next();
    })
}

// READ ALL
app.get('/readAppliances', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;

    const sql = 'SELECT a.*, d.appliance_type FROM appliances a JOIN device_catalog d ON a.appliance_id = d.appliance_id WHERE a.user_id = (?)';
    db.query(sql, [user_id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// CREATE
app.post('/addAppliance', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const {appliance_id, appliance_room} = req.body;
    
    const checkSql = 'SELECT appliance_type FROM device_catalog WHERE appliance_id = (?)';
    db.query(checkSql, [appliance_id], (err,catalogResult) => {
        if(err) return res.json(err)
        if(catalogResult.length === 0) return res.json({Message: "Invalid appliance id"})
    
        const deviceType = catalogResult[0].appliance_type;
        let appliance_name = "";
        let appliance_img = "";
        let appliance_status = "off";

        if(deviceType === "light"){
            appliance_name = "Smart Light";
            appliance_img = "https://cdn-icons-png.flaticon.com/512/4575/4575390.png";
        }
        else if(deviceType === "speaker"){
            appliance_name = "Smart Speaker";
            appliance_img = "https://cdn-icons-png.flaticon.com/512/4827/4827791.png";
        }
        else if(deviceType === "motor"){
            appliance_name = "Smart Fan";
            appliance_img = "https://cdn-icons-png.flaticon.com/512/3060/3060734.png";
        }
        else {
            appliance_name = "Smart Appliance";
            appliance_img = "https://cdn-icons-png.flaticon.com/512/1857/1857064.png";
        }

        const checkOwnership = 'SELECT * FROM appliances WHERE appliance_id = (?)';
        db.query(checkOwnership, [appliance_id], (err2, ownershipResult) => {
            if(err2) return res.json(err2)
            if(ownershipResult.length > 0) return res.json({Message: "This appliance is already registed to another account"})
    
            const insertSql = 'INSERT INTO appliances (user_id, appliance_id, appliance_name, appliance_img, appliance_room, appliance_status) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(insertSql, [user_id, appliance_id, appliance_name, appliance_img, appliance_room, appliance_status], (err3) => {
                if(err3) return res.json(err3)
                return res.json({Message: `Successfully added ${appliance_name} in ${appliance_room}`});
            })
        })
    })  
})

// READ SINGLE
app.get('/readAppliance/:id', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const appliance_id = req.params.id;

    const sql = 'SELECT * FROM appliances WHERE appliance_id = (?) AND user_id = (?)';
    db.query(sql, [appliance_id, user_id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// READ ROOM
app.get('/readRoom/:roomName', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const {roomName} = req.params;

    const sql = 'SELECT * FROM appliances WHERE appliance_room = (?) AND user_id = (?)';
    db.query(sql, [roomName, user_id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// UPDATE
app.put('/updateAppliance/:id', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const appliance_id = req.params.id;
    const {appliance_name, appliance_room} = req.body;

    const sql = 'UPDATE appliances SET appliance_name = (?), appliance_room = (?) WHERE appliance_id = (?) AND user_id = (?)';
    db.query(sql, [appliance_name, appliance_room, appliance_id, user_id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// UPDATE ROOM NAME
app.put('/updateRoom/:oldRoomName', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const {oldRoomName} = req.params;
    const {appliance_room} = req.body;

    const sql = 'UPDATE appliances SET appliance_room = (?) WHERE appliance_room = (?) AND user_id = (?)';
    db.query(sql, [appliance_room, oldRoomName, user_id,], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// UPDATE APPLIANCE STATUS
app.put('/updateApplianceStatus/:id', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const appliance_id = req.params.id;
    const {appliance_status} = req.body;

    const sql = 'UPDATE appliances SET appliance_status = (?) WHERE appliance_id = (?) AND user_id = (?)';
    db.query(sql, [appliance_status, appliance_id, user_id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// DELETE
app.delete('/deleteAppliance/:id', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const appliance_id = req.params.id;

    const sql = 'DELETE FROM appliances WHERE appliance_id = (?) AND user_id = (?)';
    db.query(sql, [appliance_id, user_id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// DELETE ROOM
app.delete('/deleteRoom/:roomName', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;
    const {roomName} = req.params;

    const sql = 'DELETE FROM appliances WHERE appliance_room = (?) AND user_id = (?)';
    db.query(sql, [roomName, user_id,], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// SEND VALUE TO ESP32
app.get('/getApplianceStatus', authenticateToken, (req, res) => {
    const user_id = req.user.user_id;

    const sql = 'SELECT appliance_id, appliance_status FROM appliances WHERE user_id = (?)';
    db.query(sql, [user_id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

app.listen(5000, () => {
    console.log('Server is running')
})