import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router';
import axios from 'axios'
import Password from 'antd/es/input/Password';
import { URL_TOKEN } from '../constants/urls';
import { PATH } from '../routes/customRoute';
import useAuth from '../context/authContext';

axios.defaults.baseURL = 'http://localhost:8000'

export default function LoginPage () {

    const [messageApi, contextHolder] = message.useMessage();
    const { login, user } = useAuth()
    const navigate = useNavigate()

    const onFinish = async (values) => {
    console.log('Success:', values);
    try{
        const response = await axios.post(URL_TOKEN.TOKEN, {username : values.username, password: values.password})
        const token = response.data.access
        await login(token)
        axios.defaults.headers.common = { 'Authorization' : `Bearer ${token}`}
        if (user?.groups?.includes("admin")){
            navigate(`/${PATH.STUDENT}`)
        } else {
            navigate(`/${PATH.ATTENDANCE}`)
        }
    }
    catch (err) {
        messageApi.open({
            type : 'error',
            content : 'Login failed'
        }) 
    }
    };

    const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
        messageApi.open({
            type : 'error',
            content : 'login error'
        })
    };

    return(
    <Form
        name="basic"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        {contextHolder}
        <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
        >
        <Input />
        </Form.Item>

        <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        >
        <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
    </Form>
    );
}
