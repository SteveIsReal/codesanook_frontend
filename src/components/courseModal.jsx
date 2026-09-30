import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, message, Modal, Select, Space, TimePicker, Button } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { URL_CLASSROOM } from "../constants/urls";

export default function CourseModal(props){

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const Sub = () => {
        const x = Form.useFormInstance()
        return props.isCreateCourse ? form.resetFields() : form.setFieldsValue(props.editCourseData)
    }

    const WEEKDAYS = [
        {value: "MONDAY", label: "Monday"},
        {value: "TUESDAY", label: "Tuesday"},
        {value: "WEDNESDAY", label: "Wednesday"},
        {value: "THRUSDAY", label: "Thrusday"},
        {value: "FRIDAY", label: "Friday"},
        {value: "SATURDAY", label: "Saturday"},
        {value: "SUNDAY", label: "Sunday"},
    ]

    const onSubmit = async () => {
        const validate = await form.validateFields()
        const formData = await form.getFieldsValue()

        console.log(formData)
        
        try{
            const response = props.isCreateCourse ? 
            await axios.post(URL_CLASSROOM.COURSE, formData) : await axios.patch(`${URL_CLASSROOM.COURSE}${props.editCourseData.id}/`, formData)
            console.log(response)
            onCancel()
        }
        catch (err) {
            console.log(err.response.data.info)
            messageApi.open({type: 'error', content: err.response.data.info.map(v => `${v} is registered`)})
        }
    }

    const onCancel = () => {
        props.closeModal()
    }

    return (
    <Modal open={props.isCreateCourse || props.editCourseData != null} onCancel={onCancel} onOk={onSubmit}>
        {contextHolder}
        <h2>Create course</h2>
        <Form form={form}>
            <Form.Item label="Course Name" name="name" rules={[{required:true}]}>
                <Input />
            </Form.Item>
            <Form.Item label="Teacher" name="teacher" rules={[{required:true}]}> 
                <Select options={props.teacherData} onChange={() => 0}/>
            </Form.Item>
            <Form.Item label="Students" name='students' rules={[{required:true}]}>
                <Select mode="multiple" placeholder="select students" options={props.studentData} optionFilterProp={"label"} />
            </Form.Item>
            <Form.Item label="Curriculum" name="curriculum" rules={[{required:true}]}>
                <Select options={props.curriculum} />
            </Form.Item>
            <Form.Item label={"Select time slots"} name={"time_slots"}>
                <Select mode="multiple" options={props.timeSlotData} allowClear placeholder={"Choose time slots"} optionFilterProp={"label"}/>
            </Form.Item>
            <Form.Item label="Max session" name='max_session' rules={[{required:true}]}>
                <InputNumber />
            </Form.Item>
            <Form.Item label="Deduct credit" name="deduct_credit" rules={[{required:true}]}>
                <InputNumber />
            </Form.Item>
        </Form>
        <Sub />
    </Modal>
)
}