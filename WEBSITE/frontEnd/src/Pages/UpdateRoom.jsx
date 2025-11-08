import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { handleDeleteRoom, handleReadRoom, handleUpdateRoom } from "../API";
import { Typography, Form, Input } from "antd";

function UpdateRoom(){
    const [newRoomName, setNewRoomName] = useState({ appliance_room: '' })
    const {oldRoomName} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        handleReadRoom(oldRoomName, setNewRoomName);
    }, [oldRoomName])

    const submitUpdatedName = (e) => {
        handleUpdateRoom(e, oldRoomName, newRoomName, navigate);
    }

    const deleteRoom = () => {
        handleDeleteRoom(oldRoomName, navigate);
    }

    const cancelUpdate = () => {
        navigate('/home');
    }

    return(
        <div className="room-info-container">
            <div className="room-info-form">
                <div className="room-info-form-header">
                    <h2>Update Room Name</h2>
                </div>
                <Form layout='vertical'>
                    <Form.Item
                        label="New Room Name"
                        name="appliance_room"
                        rules={[{ required: true, message: "Please enter a new name for the room"}]}>
                            <Input placeholder="Enter a New Room Name"
                                    value={newRoomName.appliance_room}
                                    onChange={(e) => {setNewRoomName({...newRoomName, appliance_room: e.target.value})}} />
                    </Form.Item>
                    <div className="button-group">
                        <button type="button" className="updateButton" onClick={submitUpdatedName}>Update</button>
                        <button type="button" className="deleteButton" onClick={deleteRoom}>Delete</button>
                        <button type="button" className="cancelButton" onClick={cancelUpdate}>Cancel</button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default UpdateRoom