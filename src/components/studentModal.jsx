import React, { useEffect } from 'react';
import axios from 'axios'
import { Modal, Form, Input, Select, message } from "antd";

export default function StudentModal(props) {

    const [form] = Form.useForm()

    const cancel = () => {
        form.resetFields()
        props.onCancel()
    }

    const Submit = async () => { 
        const validate = await form.validateFields()
        const formData = form.getFieldsValue()
        if (props.isCreateStudent){
            const response = await axios.post('/api/member/student/', formData) 
        }
        else{
            const response = await axios.patch(`/api/member/student/${props.editStudentData.id}/`, formData)
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
            <Form.Item label="Name" name="name" rules={[{required : true}]}>
                <Input />
            </Form.Item>
            <Form.Item label="School" name="school" rules={[{required : true}]}>
                <Select options={props.schoolList}></Select>
            </Form.Item>

        </Form>
    </Modal>
    )

}