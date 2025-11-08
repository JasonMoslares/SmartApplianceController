import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { handleCreate, handleLogout } from '../../API';

function Header(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
        else{
            setUser(null);
        }
    }, [location])

    const handleOut= () => {
        handleLogout(setUser, navigate);
    }

    let headerContent;

    if(user){
        headerContent = (
            <div className="header">
                <div className="header-left">
                    <img src='https://cdn-icons-png.flaticon.com/512/2922/2922393.png'></img>
                </div>
                <div className="header-center">
                    <h2>Smart Appliance Controller</h2>
                </div>
                <div className="header-right">
                    <h4>Hi, {user.name}</h4>
                    <button className="logoutButton" onClick={handleOut}>Logout</button>
                </div>
            </div>
        );
    }
    else{
        headerContent = (
            <div className="header">
                 <div className="header-left">
                    <img src='https://cdn-icons-png.flaticon.com/512/2922/2922393.png'></img>
                </div>
                <div className="header-center">
                    <h2>Smart Appliance Controller</h2>
                </div>
                <div className="header-right">
                    <Link className="loginHeaderButton" to={'/'}>Login</Link>
                    <Link className="registerHeaderButton" to={'/register'}>Register</Link>
                </div>
            </div>
        );
    }

    return <header className="header">{headerContent}</header>;
}

export default Header