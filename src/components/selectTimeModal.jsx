import { useState, useEffect } from 'react'
import { Button, Card, Checkbox, Form, Input, Modal, Select } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import CheckableTag from 'antd/es/tag/CheckableTag';

export default function SelectTimeModal(props){

    return (
    <Modal open={1} closeIcon={false}>
        <Form>
            <Form.Item label={"Select time slots"} name={"selected_time_slots"}>
                <Select mode="multiple" options={props.timeSlotData} allowClear placeholder={"Choose time slots"}/>
            </Form.Item>
        </Form>
    </Modal>
    )
}