import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router';
import axios from 'axios'
import Password from 'antd/es/input/Password';

axios.defaults.baseURL = 'http://localhost:8000'

export default function LoginPage () {

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()

    const onFinish = async (values) => {
    console.log('Success:', values);
    try{
        const response = await axios.post('/api/token/', {username : values.username, password: values.password})
        const token = response.data.access
        axios.defaults.headers.common = { 'Authorization' : `bearer ${token}`}
        console.log(axios.defaults.headers.common)
        navigate('menu')
    }
    catch (err) {
        messageApi.open({
            type : 'error',
            content : 'login failed'
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
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
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