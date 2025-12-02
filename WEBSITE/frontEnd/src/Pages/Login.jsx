import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { handleLogin } from "../API";
import { Form, Input} from 'antd';

function Login(){
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState('');

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try{
            const success = await handleLogin(values);
            if(success){
                navigate('/home');
            }
            else{
                setErrorMessage('Invalid credentials');
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
                    <h2>Log In</h2>
                </div>
                <Form form={form} layout='vertical' onFinish={handleSubmit}>
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[{ required: true, message: "Enter your email address" }]}>
                            <Input placeholder="Enter your email address"
                                    value={values.email}
                                    onChange={(e) => setValues({...values, email: e.target.value})} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Enter your password" }]}>
                            <Input.Password placeholder="Enter your password"
                                    value={values.password}
                                    onChange={(e) => setValues({...values, password: e.target.value})} />
                    </Form.Item>

                    {errorMessage && (
                        <Form.Item>
                            <div className="error-message">
                                <h4>{errorMessage}</h4>
                            </div>
                        </Form.Item>
                    )}

                    <button type="submit" className="loginButton">Log In</button>

                    <div className="register-link">
                        <p>
                            Don't have an account?{" "}
                            <a href="/register">Register here</a>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Login