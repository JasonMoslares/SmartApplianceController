import axios from "axios"

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
})

// Register
export const handleRegister = (formData, nav) => {
    axios.post('http://localhost:5000/register', formData)
    .then(res => {console.log(res); alert(res.data.Message);
        if(res.data.Message === "Registration successful"){
            nav('/');
        }
    })
    .catch(err => {console.log(err)})
}

// Login
export const handleLogin = (formData, nav) => {
    axios.post('http://localhost:5000/login', formData)
    .then(res => {console.log(res);
        if(res.data.token){
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("Login successful!");
            nav('/home');
        }
        else{
            alert(res.data.Message || "Invalid credentials");
        }
    })
    .catch(err => {console.log(err)});
}

export const handleLogout = (setVarName, nav) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setVarName(null);
    nav('/')
}

//Read All Appliance
export const fetchData = (setVarName) => {
    axios.get('http://localhost:5000/readAppliances', getAuthHeaders())
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

//Create Appliance
export const handleCreate = (e, varName, nav) => {
    e.preventDefault();
    axios.post('http://localhost:5000/addAppliance', varName, getAuthHeaders())
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

//Read Single Appliance
export const handleRead = (id, setVarName) => {
    axios.get(`http://localhost:5000/readAppliance/${id}`, getAuthHeaders())
    .then(res => {console.log(res); 
        if(res.data.length > 0){
            setVarName({appliance_name: res.data[0].appliance_name})}
        })
    .catch(err => {console.log(err)})
}

//Read Room
export const handleReadRoom = (roomName, setVarName) => {
    axios.get(`http://localhost:5000/readRoom/${roomName}`, getAuthHeaders())
    .then(res => {console.log(res); 
        if(res.data.length > 0){
            setVarName({appliance_room: res.data[0].appliance_room})}
        })
    .catch(err => {console.log(err)})
}

//Update Appliance Name and Room Assignment
export const handleUpdate = (e, id, varName, nav) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/updateAppliance/${id}`, varName, getAuthHeaders())
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

//Update Appliance State
export const handleUpdateStatus = (id, varName) => {
    axios.put(`http://localhost:5000/updateApplianceStatus/${id}`, varName, getAuthHeaders())
    .then(res => {console.log(res)})
    .catch(err => {console.log(err)})
}


//Update Room Name
export const handleUpdateRoom = (e, oldRoomName, varName, nav) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/updateRoom/${oldRoomName}`, varName, getAuthHeaders())
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

//Delete Appliance
export const handleDelete = (id, nav) => {
    axios.delete(`http://localhost:5000/deleteAppliance/${id}`, getAuthHeaders())
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

//Delete Room
export const handleDeleteRoom = (roomName, nav) => {
    axios.delete(`http://localhost:5000/deleteRoom/${roomName}`, getAuthHeaders())
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})

}