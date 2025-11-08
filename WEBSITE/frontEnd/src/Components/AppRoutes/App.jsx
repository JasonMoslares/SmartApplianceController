import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from '../AppHeader/Header';
import Create from "../../Pages/Create";
import Home from "../../Pages/Home";
import Update from "../../Pages/Update";
import Register from '../../Pages/Register';
import Login from '../../Pages/Login';
import UpdateRoom from '../../Pages/UpdateRoom';

function App(){
    return(
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<Login />} />
                <Route path='/home' element={<Home />} />
                <Route path='/create' element={<Create />} />
                <Route path='/edit/:id' element={<Update />}/>
                <Route path='/updateRoom/:oldRoomName' element={<UpdateRoom />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App