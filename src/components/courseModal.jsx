import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, message, Modal, Select, Space, TimePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";

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

        // console.log(formData.time[0])

        // formData['start_time'] = typeof(formData.time[0]) == "string" ? formData.time[0] :formData.time[0].format('HH:mm')
        // formData['end_time'] = typeof(formData.time[1]) == "string" ? formData.time[1] :formData.time[1].format("HH:mm")

        console.log(formData)
        
        try{
            const response = props.isCreateCourse ? 
            await axios.post('/api/classroom/course/', formData) : await axios.patch(`/api/classroom/course/${props.editCourseData.id}/`, formData)
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
            <Form.Item label="Course Name" name="name" required>
                <Input />
            </Form.Item>
            <Form.Item label="Teacher" name="teacher" required>
                <Select options={props.teacherData} onChange={() => 0}/>
            </Form.Item>
            <Form.Item label="Students" name='students' required>
                <Select mode="multiple" placeholder="select students" options={props.studentData} optionFilterProp={"label"} />
            </Form.Item>
            <Form.Item label="Max session" name='max_session' required>
                <InputNumber />
            </Form.Item>
            <Form.Item label="Deduct credit" name="deduct_credit" required>
                <InputNumber />
            </Form.Item>
        </Form>
        <Sub />
    </Modal>
)
}