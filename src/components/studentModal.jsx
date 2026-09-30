import React, { useEffect } from 'react';
import axios from 'axios'
import { Modal, Form, Input, Select, message, Switch } from "antd";
import { URL_MEMBER } from '../constants/urls';

export default function StudentModal(props) {

    const [form] = Form.useForm()

    const cancel = () => {
        props.onCancel()
        form.resetFields()
    }

    const Submit = async () => { 
        const validate = await form.validateFields()
        const formData = form.getFieldsValue()
        if (props.isCreateStudent){
            const response = await axios.post(URL_MEMBER.STUDENT, formData) 
        }
        else{
            const response = await axios.patch(`${URL_MEMBER.STUDENT}${props.editStudentData.id}/`, formData)
        }
        props.fetchStudent()
        cancel()
    }

    useEffect(() => {
        if(props.editStudentData != null){
            console.log(props.editStudentData)
            form.setFieldsValue(props.editStudentData)
        }
    }, [props.editStudentData])

    return (
    <Modal open={props.isCreateStudent || props.editStudentData} onOk={Submit} onCancel={cancel}>
        <h1>{props.isCreateStudent ? "Add" : "Edit"} Student</h1>
        <Form form={form}>
            <Form.Item label="First Name" name="first_name" rules={[{required : true}]}>
                <Input />
            </Form.Item> 
            <Form.Item label="Last Name" name="last_name" rules={[{required : true}]}>
                <Input />
            </Form.Item>
            <Form.Item label="Nickname" name="nickname" rules={[{required : true}]}>
                <Input />
            </Form.Item>
            <Form.Item label="School" name="school" rules={[{required : true}]}>
                <Select options={props.schoolList}></Select>
            </Form.Item>
            <Form.Item label="Registered" name="is_student">
                <Switch defaultValue={false}/>
            </Form.Item>

        </Form>
    </Modal>
    )

}