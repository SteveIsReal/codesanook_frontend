import {useState, useEffect} from 'react'
import {Form, Modal} from 'antd'

export default function editTimeModal(props){
  return (
    <Modal>
    <Form>
  
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