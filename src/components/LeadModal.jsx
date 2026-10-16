
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Modal, Form, Input, Select, message, Switch, Typography, Flex, Space } from "antd";
import AddLeadIcon from '@mui/icons-material/PersonAddOutlined'
import EditLeadIcon from "@mui/icons-material/EditSquare"
import { URL_MEMBER } from '../constants/urls';
import bordered from 'antd/es/pagination/style/bordered';
import '../styles/modal.css'

export default function LeadModal(props) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const cancel = (update) => {
        props.onCancel(update)
    }

    const Submit = async () => { 
      try{
        setLoading(true)
        const validate = await form.validateFields()
        const formData = form.getFieldsValue()
        if (props.isCreateLead){
            const response = await axios.post(URL_MEMBER.LEAD, formData) 
        }
        else{
            const response = await axios.patch(`${URL_MEMBER.LEAD}${props.editLeadData.id}/`, formData)
        }
        cancel(true)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
        if(props.editLeadData != null){
            form.setFieldsValue(props.editLeadData)
        }
    }, [props.editLeadData])

    return (
    <Modal 
    open={props.isCreateLead || props.editLeadData} 
    onOk={Submit} 
    onCancel={() => cancel(false)} 
    afterClose={form.resetFields} 
    getContainer={false}
    mask={{blur: true}}
    okText={"Submit"}
    className={"modal"}
    title={(
    <Space>
        <Space className={"icon"}>
            {props.isCreateLead ? <AddLeadIcon /> : <EditLeadIcon />}
        </Space>
        <Typography className={"modal-header"}>
            {props.isCreateLead ? "Add New" : "Edit"} Lead
        </Typography>
    </Space>
    )}
    >
        <Form form={form} layout="vertical" initialValues={{"is_Lead": false}}>
            <Form.Item 
            label="First Name" 
            name="first_name" 
            rules={[{required : true}]} 
            >
                <Input placeholder={"First name"}/>
            </Form.Item> 
            <Form.Item label="Last Name" name="last_name" rules={[{required : true}]}>
                <Input placeholder={"Last name"}/>
            </Form.Item>
            <Form.Item label="Nickname" name="nickname" rules={[{required : true}]}>
                <Input placeholder={"Nickname"}/>
            </Form.Item>
            <Form.Item layout="horizontal" label="School" name="school" rules={[{required : true}]}>
                <Select options={props.schoolList} placeholder={"Select school"}/>
            </Form.Item>
        </Form>
    </Modal>
    )

}