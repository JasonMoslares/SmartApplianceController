import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'smart_home',
    port: 3307
})

console.log('Connected to MySQL database successfully');

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
app.get('/readAppliances', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;

        const [result] = await db.execute('SELECT a.*, d.appliance_type FROM appliances a JOIN device_catalog d ON a.appliance_id = d.appliance_id WHERE a.user_id = ?', [user_id]);
        return res.json(result);
    }
    catch(err){
        console.log('Read All Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

// CREATE
app.post('/addAppliance', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;
        const {appliance_id, appliance_room} = req.body;

        const [ownershipResult] = await db.execute('SELECT * FROM appliances WHERE appliance_id = ?', [appliance_id]);
        if(ownershipResult.length > 0 && ownershipResult[0].user_id !== user_id){
            return res.status(400).json({Message: "This appliance is already registed to another account"});
        }
        else{
            const [catalogResult] = await db.execute('SELECT appliance_type FROM device_catalog WHERE appliance_id = ?', [appliance_id]);
            if(catalogResult.length === 0){
                return res.status(400).json({Message: "Invalid appliance id"});
            }
            else{
                const deviceType = catalogResult[0].appliance_type;
                let appliance_name = "";
                let appliance_img = "";

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

                const [insertResult] = await db.execute('INSERT INTO appliances (user_id, appliance_id, appliance_name, appliance_img, appliance_room) VALUES (?, ?, ?, ?, ?)', [user_id, appliance_id, appliance_name, appliance_img, appliance_room]);
                return res.json({Message: `Successfully added ${appliance_name} in ${appliance_room}`});
            }
        }
    }
    catch(err){
        console.log('Enroll Appliance Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

// READ SINGLE
app.get('/readAppliance/:appliance_id', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;
        const {appliance_id} = req.params;

        const [result] = await db.execute('SELECT * FROM appliances WHERE appliance_id = ? AND user_id = ?', [appliance_id, user_id]);
        return res.json(result);
    }
    catch(err){
        console.log('Read Single Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

// READ ROOM
app.get('/readRoom/:roomName', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;
        const {roomName} = req.params;

        const [result] = await db.execute('SELECT * FROM appliances WHERE appliance_room = ? AND user_id = ?', [roomName, user_id]);
        return res.json(result);
    }
    catch(err){
        console.log('Read Room Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

// UPDATE
app.put('/updateAppliance/:appliance_id', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;
        const {appliance_id} = req.params;
        const {appliance_name, appliance_room} = req.body;

        const [result] = await db.execute('UPDATE appliances SET appliance_name = ?, appliance_room = ? WHERE appliance_id = ? AND user_id = ?', [appliance_name, appliance_room, appliance_id, user_id]);
        return res.json(result);
    }
    catch(err){
        console.log('Update Appliance Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

// UPDATE ROOM NAME
app.put('/updateRoom/:oldRoomName', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;
        const {oldRoomName} = req.params;
        const {appliance_room} = req.body;

        const [result] = await db.execute('UPDATE appliances SET appliance_room = ? WHERE appliance_room = ? AND user_id = ?', [appliance_room, oldRoomName, user_id]);
        return res.json(result);
    }
    catch(err){
        console.log('Update Room Name Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

// UPDATE APPLIANCE STATUS
app.put('/updateApplianceStatus/:appliance_id', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;
        const {appliance_id} = req.params;
        const {appliance_status} = req.body;

        const [result] = await db.execute('UPDATE appliances SET appliance_status = ? WHERE appliance_id = ? AND user_id = ?', [appliance_status, appliance_id, user_id]);
        return res.json(result);
    }
    catch(err){
        console.log('Update Appliance Status Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

// DELETE
app.delete('/deleteAppliance/:appliance_id', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;
        const {appliance_id} = req.params;

        const [result] = await db.execute('DELETE FROM appliances WHERE appliance_id = ? AND user_id = ?', [appliance_id, user_id]);
        return res.json(result)
    }
    catch(err){
        console.log('Delete Appliance Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

// DELETE ROOM
app.delete('/deleteRoom/:roomName', authenticateToken, async (req, res) => {
    try{
        const {user_id} = req.user;
        const {roomName} = req.params;

        const [result] = await db.execute('DELETE FROM appliances WHERE appliance_room = ? AND user_id = ?', [roomName, user_id]);
        return res.json(result);
    }
    catch(err){
        console.log('Delete Room Error: ', err);
        return res.status(500).json({Message: 'Server error', error: err.message})
    }
})

app.listen(5000, () => {
    console.log('Server is running')
})