import React from "react";
import axios from 'axios'
import { Modal, Form, Input, message } from "antd";


export default function TeacherModal(props) {

    const [form] = Form.useForm()
    const [messageInfo, contentHolder] = message.useMessage()

    const Sub = () => {
        const form = Form.useFormInstance()

        return (props.isAddTeacher ? form.resetFields() : form.setFieldsValue(props.editData))
    }

    const submitForm = async () => {
        try{
        const validate = await form.validateFields()
        const formData = form.getFieldsValue()  

        if (props.isAddTeacher){
            const response = await axios.post('/api/member/teacher/', {"user" : {...formData}})

        }
        else {

            const response = await axios.patch(`/api/member/teacher/${props.editData.id}/`, {"user": formData})
        }

        props.onSuccess()

        } catch (err) {
            messageInfo.open({
                type: "error",
                content: err.message
            })
        }
    }

    return (
        <Modal open={props.editData != null || props.isAddTeacher} onCancel={() => {props.setEditData(null); props.setIsAddTeacher(false)}} onOk={submitForm}>
            {contentHolder}
            <h2>{props.isAddTeacher ? "Create" : "Edit"} Teacher</h2>
            <Form validateMessages={{ required: 'Please input your ${label}'}} form={form}>
                {props.isAddTeacher ? 
                <>
                <Form.Item label="Username" name="username" rules={[{ required : true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required : true }]}>
                    <Input.Password />
                </Form.Item>
                </>
                :false}
                <Form.Item label="First name" name="first_name" rules={[{ required : true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Last name" name="last_name" rules={[{ required : true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required : true }]}>
                    <Input />
                </Form.Item>
                <Sub/> 
            </Form>
        </Modal>
    )
}