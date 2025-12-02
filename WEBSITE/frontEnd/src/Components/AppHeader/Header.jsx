import { useNavigate, Link } from 'react-router-dom';
import { handleLogout } from '../../API';

function Header(){
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleOut= () => {
        handleLogout(navigate);
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