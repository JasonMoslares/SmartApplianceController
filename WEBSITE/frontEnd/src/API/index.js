import api from "./api";


const AUTH_URL = process.env.REACT_APP_API_AUTH_URL || "http://localhost:4000";
const APPL_URL = process.env.REACT_APP_API_APPL_URL || "http://localhost:5000";

// Register
export const handleRegister = async (formData) => {
    return api.post(`${AUTH_URL}/register`, formData)
    .then(res => {console.log(res); return true;})
    .catch(err => {console.log(err); return false;})
}

// Login
export const handleLogin = async (formData) => {
    return api.post(`${AUTH_URL}/`, formData)
    .then(res => {console.log(res);
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            return true;
    })
    .catch(err => {console.log(err); return false});
}

export const handleLogout = (nav) => {
    api.delete(`${AUTH_URL}/logout`, {headers: {'x-refresh-token': localStorage.getItem('refreshToken')}})
    .then(res => {console.log(res);
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                localStorage.removeItem("user");
                nav('/')})
    .catch(err => {console.log(err)})
}

//Read All Appliance
export const fetchData = (setVarName) => {
    api.get(`${APPL_URL}/readAppliances`)
    .then(res => {console.log(res); setVarName(res.data)})
    .catch(err => {console.log(err)})
}

//Create Appliance
export const handleCreate = (varName) => {
    return api.post(`${APPL_URL}/addAppliance`, varName)
    .then(res => {console.log(res); return res.data.Message;})
    .catch(err => {console.log(err); 
                    if(err.response && err.response.data && err.response.data.Message){
                        return err.response.data.Message;
                    }
                    return "Server error";})
}

//Read Single Appliance
export const handleRead = (id, setVarName) => {
    api.get(`${APPL_URL}/readAppliance/${id}`)
    .then(res => {console.log(res); 
        if(res.data.length > 0){
            setVarName({appliance_name: res.data[0].appliance_name})}
        })
    .catch(err => {console.log(err)})
}

//Read Room
export const handleReadRoom = (roomName, setVarName) => {
    api.get(`${APPL_URL}/readRoom/${roomName}`)
    .then(res => {console.log(res); 
        if(res.data.length > 0){
            setVarName({appliance_room: res.data[0].appliance_room})}
        })
    .catch(err => {console.log(err)})
}

//Update Appliance Name and Room Assignment
export const handleUpdate = (e, id, varName, nav) => {
    e.preventDefault();
    api.put(`${APPL_URL}/updateAppliance/${id}`, varName)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

//Update Appliance State
export const handleUpdateStatus = (id, varName) => {
    api.put(`${APPL_URL}/updateApplianceStatus/${id}`, varName)
    .then(res => {console.log(res)})
    .catch(err => {console.log(err)})
}


//Update Room Name
export const handleUpdateRoom = (e, oldRoomName, varName, nav) => {
    e.preventDefault();
    api.put(`${APPL_URL}/updateRoom/${oldRoomName}`, varName)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

//Delete Appliance
export const handleDelete = (id, nav) => {
    api.delete(`${APPL_URL}/deleteAppliance/${id}`)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})
}

//Delete Room
export const handleDeleteRoom = (roomName, nav) => {
    api.delete(`${APPL_URL}/deleteRoom/${roomName}`)
    .then(res => {console.log(res); nav('/home')})
    .catch(err => {console.log(err)})

}