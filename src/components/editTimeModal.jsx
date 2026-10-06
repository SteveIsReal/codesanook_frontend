import {useState, useEffect} from 'react'
import {Form, Modal, TimePicker, Select} from 'antd'
import { WEEKDAYS } from '../constants/const_string';
import dayjs from 'dayjs'
import axios from 'axios';
import { URL_CLASSROOM } from '../constants/urls';

export default function editTimeModal(props){

  const [form] = Form.useForm()
  
  const onSubmit = async () => {
    const formData = form.getFieldsValue()

    const data = {
      ...formData,
      start_time: formData.time[0].format("HH:mm:ss"),
      end_time: formData.time[1].format("HH:mm:ss")
    }
    console.log(data)

    if (props.isCreateTimeSlot){
      await axios.post(URL_CLASSROOM.TIMESLOT, data)
    } else {
      await axios.patch(`${URL_CLASSROOM.TIMESLOT}${props.editTimeSlotData.id}/`, data)
    }
    
    props.closeEditTimeSlot()
  }

  useEffect(() => {
    form.resetFields()
    if (props.editTimeSlotData){
      const formData = {
        ...props.editTimeSlotData,
        time: props.editTimeSlotData.time.map(d => dayjs(d, "HH:mm:ss"))
      }
      form.setFieldsValue(formData)
    }
  }, [props.isCreateTimeSlot, props.editTimeSlotData])

  return (
    <Modal open={props.isCreateTimeSlot || props.editTimeSlotData} onCancel={props.closeEditTimeSlot} onOk={onSubmit} closeIcon={false}>
    <Form form={form}>
      <Form.Item label="Time" name="time" rules={[{ required: true, message: "Please select time!" }]}>
        <TimePicker.RangePicker format="HH:mm" />
      </Form.Item>
      <Form.Item label="Weekday" name="weekday" rules={[{ required: true, message: "Please select weekday!" }]}>
        <Select placeholder="Choose day" options={WEEKDAYS} />
      </Form.Item>
      <Form.Item label="Room" name="room" rules={[{ required: true, message: "Please select room!" }]}>
        <Select placeholder="Choose room" options={props.roomData} />
      </Form.Item>
    
    </Form>
    </Modal>
  )
}