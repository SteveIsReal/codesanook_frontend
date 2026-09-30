import React, { useEffect } from 'react';
import axios from 'axios'
import { Modal, Form, Input, Select, message } from "antd";
import { URL_CLASSROOM } from '../constants/urls';

export default function RoomModal(props) {

    const [form] = Form.useForm()

    const cancel = () => {
        form.resetFields()
        props.onCancel()
    }

    const Submit = async () => { 
        const validate = await form.validateFields()
        const formData = form.getFieldsValue()
        if (props.isCreateRoom){
            const response = await axios.post(URL_CLASSROOM.ROOM, formData) 
        }
        else{
            const response = await axios.patch(`${URL_CLASSROOM.ROOM}{props.editRoomData.id}/`, formData)
        }
        props.fetchRoom()
        cancel()
    }

    useEffect(() => {
        if(props.editRoomData != null){
            console.log(props.editRoomData)
            form.setFieldsValue(props.editRoomData)
        }
    }, [props.editRoomData])

    return (
    <Modal open={props.isCreateRoom || props.editRoomData} onOk={Submit} onCancel={cancel}>
        <h1>{props.isCreateRoom ? "Add" : "Edit"} room</h1>
        <Form form={form}>
            <Form.Item label="Name" name="name" rules={[{required : true}]}>
                <Input />
            </Form.Item>
        </Form>
    </Modal>
    )

}