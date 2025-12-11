import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { handleCreate } from "../API";
import { Form, Input, Typography } from 'antd';

function Create(){
    const [values, setValues] = useState({appliance_id: '', appliance_room: ''})
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const result = await handleCreate(values);

        if (result.startsWith("Successfully added")) {
            navigate('/home');
        } else {
            setErrorMessage(result);
        }
    };

    const cancelCreate = () => {
        navigate('/home');
    }

    return(
        <div className="appliance-info-container">
            <div className="appliance-info-form">
                <div className="appliance-info-form-header">
                    <h2>Add Appliance</h2>
                </div>
                <Form form={form} layout='vertical' onFinish={handleSubmit}>
                    <Form.Item
                        label="Appliance ID"
                        name="appliance_id"
                        rules={[{ required: true, message: 'Please enter the appliance id' }]}>
                            <Input placeholder="Enter Appliance ID"
                                    value={values.appliance_id}
                                    onChange={(e) => setValues({...values, appliance_id: e.target.value})} />
                    </Form.Item>
                    <Form.Item
                        label="Appliance Room"
                        name="appliance_room"
                        rules={[{ required: true, message: 'Please enter the room for the appliance' }]}>
                            <Input placeholder="Enter Where to Put the Appliance"
                                    value={values.appliance_room}
                                    onChange={(e) => setValues({...values, appliance_room: e.target.value})} />
                    </Form.Item>

                    {errorMessage && (
                        <Form.Item>
                            <div className="error-message">
                                <h4>{errorMessage}</h4>
                            </div>
                        </Form.Item>
                    )}

                    <div className="button-group">
                        <button type="submit" className="createButton">Create</button>
                        <button type="button" className="cancelButton" onClick={cancelCreate}>Cancel</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Create