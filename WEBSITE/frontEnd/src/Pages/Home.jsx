import { useEffect, useState } from "react";
import { fetchData, handleUpdateStatus } from "../API";
import { Space, Typography, Card } from 'antd';
import { ChromePicker } from "react-color";
import { Link, useNavigate } from 'react-router-dom';
import { Palette, Power, X } from 'lucide-react'
import '../index.css';

function Home(){
    const [dataSource, setDataSource] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        fetchData(setDataSource)

        const interval = setInterval(() => {
            fetchData(setDataSource)
        }, 2000)

        return () => clearInterval(interval);
    }, [])

    const handleAddAppliance = () => {
        navigate("/create");
    }

    const allRooms = dataSource.map(item => item.appliance_room);
    const uniqueRoomsSet = new Set(allRooms);
    const uniqueRoomsArray = [...uniqueRoomsSet];

    return(
        <div className="home-container">
            <div className="room-container">
                <Space size={20} direction='vertical'>
                    <button className="addApplianceButton" onClick={handleAddAppliance}>Add +</button>
                    {uniqueRoomsArray.map((room) => {
                        return(
                            <RoomCard key={room}
                                        title={room}
                                        roomName={room}
                                        dataSource={dataSource} />
                        )
                    })}
                </Space>
            </div>

        </div>
    );
}

export default Home

function RoomCard({title, roomName, dataSource}) {
    return(
        <Card className="room-card">
            <div className="room-card-header">
                <div className="room-name">{title}</div>
                <Link className="editButton" to={`/updateRoom/${roomName}`}>Edit</Link>
            </div>
            <div className="appliance-list">
                <Space direction='horizontal' wrap>
                    {dataSource
                        .filter((item => item.appliance_room === title))
                        .map((device) => {
                            return(
                                <ApplianceCard key={device.appliance_id}
                                            title={device.appliance_name}
                                            applianceId={device.appliance_id}
                                            type={device.appliance_type}
                                            thumbnail={device.appliance_img}
                                            status={device.appliance_status} />
                        )
                    })}
                </Space>
            </div>
        </Card>
    )
}

function ApplianceCard({title, applianceId, type, thumbnail, status}){
    const [deviceStatus, setDeviceStatus] = useState({appliance_status: ''})
    const [color, setColor] = useState({ r: 255, g: 255, b: 255 })
    const [showPicker, setShowPicker] = useState(false)
    const [freq, setFreq] = useState(200)
    const [currentState, setCurrentState] = useState("off")
    const [lastState, setLastState] = useState("off")

    useEffect(() => {
        if(status) {
            setCurrentState(status);
        }
    }, [status]);

    const handlePower = () => {
        if(currentState === "off"){
            const newState = lastState;
            setCurrentState(newState);
            setDeviceStatus({appliance_status: newState})
            handleUpdateStatus(applianceId, {appliance_status: newState})
        }
        else{
            const newState = "off";
            setLastState(currentState);
            setCurrentState(newState);
            setDeviceStatus({appliance_status: newState})
            handleUpdateStatus(applianceId, {appliance_status: newState})
        }
    }

    const handleColorChange = (newColor) => {
        setColor(newColor.rgb);
        const rgbStr = `rgb(${newColor.rgb.r}, ${newColor.rgb.g}, ${newColor.rgb.b})`;
        setCurrentState(rgbStr);
        setDeviceStatus({appliance_status: rgbStr});
        handleUpdateStatus(applianceId, {appliance_status: rgbStr})
    }

    const togglePicker = () => {
        setShowPicker(prev => !prev);
    }

    let ColorPickerSection;

    if(showPicker){
        ColorPickerSection = (
            <div className="picker-container">
                <div className="picker-popup">
                    <ChromePicker color={color} onChange={handleColorChange} disableAlpha={true} />
                </div>
                <div className="control-layer">
                    <button className="closeButton" onClick={togglePicker}><X size={15}/></button>
                </div>
            </div>
        )
    }
    else{
        ColorPickerSection = (
            <div className="control-layer">
                <button className="controlButton" onClick={togglePicker}><Palette size={15}/></button>
            </div>
        )
    }


    const handleFreqInc = () => {
        if(freq <= 5000){
            const newFreq = freq + 100;
            setFreq(newFreq);
            const freqStr = `${newFreq}Hz`;
            setCurrentState(freqStr);
            setDeviceStatus({appliance_status: freqStr});
            handleUpdateStatus(applianceId, {appliance_status: freqStr});
        }
    }

    const handleFreqDec = () => {
        if(freq >= 200){
            const newFreq = freq - 100;
            setFreq(newFreq);
            const freqStr = `${newFreq}Hz`;
            setCurrentState(freqStr);
            setDeviceStatus({appliance_status: freqStr});
            handleUpdateStatus(applianceId, {appliance_status: freqStr});
        }
    }

    const handleSpeed = (speed) => {
        setCurrentState(speed);
        setDeviceStatus({appliance_status: speed})
        handleUpdateStatus(applianceId, {appliance_status: speed});
    }

    const SpeedSelector = (
        <div className="control-layer">
            {["slow", "moderate", "fast"].map((speed) => (
                <button key={speed}
                        className="controlButton"
                        onClick={() => handleSpeed(speed)}
                        style={{
                            backgroundColor: currentState === speed ? "green" : "gray",
                            color: currentState === speed ? "white" : "black"}}>
                                {speed === "slow" ? "1" : speed === "moderate" ? "2" : "3"}
                </button>   
            ))}
        </div>
    );

    let AppControl;
    
    if(type === "light"){
        AppControl = ColorPickerSection;
    }
    else if(type === "speaker"){
        AppControl = (
            <div className="control-layer">
                <button className="decFreqButton" onClick={handleFreqDec}>-</button>
                <button className="incFreqButton" onClick={handleFreqInc}>+</button>
            </div>
        );
    }
    else if(type === "motor"){
        AppControl = SpeedSelector;
    }

    return(
        <Card className="appliance-card">
            <div className="top-layer">
                <button className="powerButton" onClick={handlePower}><Power size={23} color="black" /></button>
                <Link className="editButton" to={`/edit/${applianceId}`}>Edit</Link>
            </div>
            <div className="device-thumbnail">
                    <img src={thumbnail} alt={`${title} thumbnail`} />
            </div>
            {AppControl}
            <div className="bottom-layer">
                <Typography.Text className="appliance-name">{title}</Typography.Text>
                <Typography.Text className="appliance-status" type='secondary'>{status}</Typography.Text>
            </div>
        </Card>
    );
}