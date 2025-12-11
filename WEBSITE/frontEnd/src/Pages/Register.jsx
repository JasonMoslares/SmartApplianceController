import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { handleRegister } from "../API";
import { Form, Input, Typography } from 'antd';

function Register(){
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState('');

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try{
            const success = await handleRegister(values);
            if(success){
                navigate('/home');
            }
            else{
                setErrorMessage('User already exists');
            }
        }
        catch(error){
            setErrorMessage('Server error: ', error);
        }
    }

    return(
        <div className="user-info-container">
            <div className="user-info-form">
                <div className="user-info-form-header">
                    <h2>Register</h2>
                </div>
                <Form form={form} layout='vertical' onFinish={handleSubmit}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Enter your name" }]}>
                            <Input placeholder="Enter your name"
                                    value={values.name}
                                    onChange={(e) => setValues({...values, name: e.target.value})} />
                    </Form.Item>
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[{ required: true, message: "Enter your Email Address" },
                                { type: "email", message: "Enter a valid Email Address" }
                        ]}>
                            <Input placeholder="Enter your Email Address"
                                    value={values.email}
                                    onChange={(e) => setValues({...values, email: e.target.value})} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Enter your password" },
                                { min: 4, message: "Password must be at least 4 characters long" }
                        ]}>
                            <Input.Password placeholder="Enter your password"
                                    value={values.password}
                                    onChange={(e) => setValues({...values, password: e.target.value})} />
                    </Form.Item>
                    <button type="submit" className="registerButton">Register</button>

                    {errorMessage && (
                        <Form.Item>
                            <div className="error-message">
                                <h4>{errorMessage}</h4>
                            </div>
                        </Form.Item>
                    )} 


                    <div className="login-link">
                        <p>
                            Already have an account?{" "}
                            <a href="/">Log in</a>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Register