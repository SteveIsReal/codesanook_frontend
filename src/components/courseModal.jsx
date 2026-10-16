import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, message, Modal, Select, Space, TimePicker, Button } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { URL_CLASSROOM } from "../constants/urls";
import { PropaneSharp } from "@mui/icons-material";

export default function CourseModal(props){

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const Sub = () => {
        const x = Form.useFormInstance()
        return props.isCreateCourse ? form.resetFields() : form.setFieldsValue({...props.editCourseData, students: props.editCourseData.students_obj.map(d => ({label:d.name, value: d.id}))})
    }

    const onSubmit = async () => {
        const validate = await form.validateFields()
        const formData = await form.getFieldsValue()
        const requestData = {...formData, students: formData.students.map(d => d.value ?? d)}

        console.log(formData.students.map(d => d.value ? true: false))
        
        try{
            setLoading(true)
            const response = props.isCreateCourse ? 
            await axios.post(URL_CLASSROOM.COURSE, requestData) : await axios.patch(`${URL_CLASSROOM.COURSE}${props.editCourseData.id}/`, requestData)
            props.closeModal(true)
        }
        catch (err) {
            console.log(err.response.data)
            messageApi.open({type: 'error', content: err.response.data?.students.map(v => `${v}`)})
        } finally {
            setLoading(false)
        }
    }

    return (
    <Modal 
    open={props.isCreateCourse || props.editCourseData != null} 
    onCancel={() => props.closeModal(false)} 
    onOk={onSubmit}
    getContainer={false}
    mask={{blur: true}}
    width={"75%"}
    loading={loading}
    >
        {contextHolder}
        <h2>Create course</h2>
        <Form form={form} layout="vertical" >
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