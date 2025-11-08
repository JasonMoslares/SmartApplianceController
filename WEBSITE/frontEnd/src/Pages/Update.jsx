import { useEffect, useState } from "react"
import { handleDelete, handleRead, handleUpdate } from "../API";
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, Typography } from 'antd';

function Update(){
    const [values, setValues] = useState({appliance_name: '', appliance_room: ''})
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        handleRead(id, setValues);
    }, [id])

    const submitAppliance = (e) => {
        handleUpdate(e, id, values, navigate);
    }

    const deleteAppliance = () => {
        handleDelete(id, navigate);
    }

    const cancelUpdate = () => {
        navigate('/home');
    }

    return(
        <div className="appliance-info-container">
            <div className="appliance-info-form">
                <div className="appliance-info-form-header">
                    <h2>Update Appliance</h2>
                </div>
                <Form layout='vertical'>
                    <Form.Item
                        label="Appliance Name"
                        name="appliance_name"
                        rules={[{ required: true, message: 'Please enter a name for the appliance' }]}>
                            <Input placeholder="Enter Appliance Name"
                                    value={values.appliance_name}
                                    onChange={(e) => {setValues({...values, appliance_name: e.target.value})}} />
                    </Form.Item>
                    <Form.Item
                        label="Appliance Room"
                        name="appliance_room"
                        rules={[{ required: true, message: 'Please enter the room for the appliance' }]}>
                            <Input placeholder="Enter Where to Put the Appliance"
                                    value={values.appliance_room}
                                    onChange={(e) => {setValues({...values, appliance_room: e.target.value})}} />
                    </Form.Item>
                    <div className="button-group">
                        <button type="button"  className="updateButton" onClick={submitAppliance}>Update</button>
                        <button type="button" className="deleteButton" onClick={deleteAppliance}>Delete</button>
                        <button type="button" className="cancelButton" onClick={cancelUpdate}>Cancel</button>
                    </div>
                </Form>
            </div>
        </div>
    )

}

export default Update