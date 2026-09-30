import { useEffect, useState } from "react";
import { Button, Form, Modal, Space, Card, TimePicker, Select, Table } from "antd";
import { useSearchParams } from "react-router";
import axios from 'axios'
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { URL_CLASSROOM } from "../constants/urls";
import EditTimeModal from "./editTimeModal2";


const WEEKDAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export default function ViewTimeModal(props) {
  const [form] = Form.useForm();
  const [timeSlotData, setTimeSlotData] = useState([])
  const [editTimeSlotData, setEditTimeSlotData] = useState(null)
  const [isCreateTimeSlot, setIsCreateTimeSlot] = useState(false)

  const fetchTimeSlot = async () => {
    const response = await axios.get(URL_CLASSROOM.TIMESLOT)
    console.log(response.data)
    setTimeSlotData(response.data)
  }

  const closeEditTimeSlot = () => {
    setIsCreateTimeSlot(false)
    setEditTimeSlotData(null)
  }

  const deleteTimeSlot = async (id) => {
    await axios.delete(`${URL_CLASSROOM.TIMESLOT}${id}/`)
    fetchTimeSlot()
    props.fetchCourse()
  }

  const timeSlotColumns = [
    {title: "Start time", dataIndex: "start_time", key: "start_time"},
    {title: "End time", dataIndex: "end_time", key:"end_time"},
    {title: "Weekday", dataIndex: "weekday", key:"weekday"},
    {title: "Room", dataIndex: "room_name", key:"room_name"},
    {title: "Action", key: "action", render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined/>} onClick={() => setEditTimeSlotData(record)}/>
        <Button icon={<DeleteOutlined/>} onClick={() => deleteTimeSlot(record.id)} danger/>
      </Space>
    )}
  ]
  
  useEffect(() => {
    fetchTimeSlot()
  }, [props.isViewTimeSlot, isCreateTimeSlot, editTimeSlotData])


  return (
    <>
    <EditTimeModal roomData={props.roomData} closeEditTimeSlot={closeEditTimeSlot} isCreateTimeSlot={isCreateTimeSlot} editTimeSlotData={editTimeSlotData} />
    <Modal open={props.isViewTimeSlot} onCancel={props.onCancel} onOk={form.submit} closeIcon={false} width={"75%"}>
      <Button icon={<PlusOutlined/>} onClick={() => setIsCreateTimeSlot(true)} type="dashed" block>Add time slot</Button>
      <Table dataSource={timeSlotData} columns={timeSlotColumns} />
    </Modal>
    </>
  );
}




      {/* <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.List name="test" >
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ width: "100%" }}>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key}>
                  <Form.Item
                    {...restField}
                    label="Time"
                    name={[name, "time"]}
                    // name="time"
                    rules={[{ required: true, message: "Please select time!" }]}
                  >
                    <TimePicker.RangePicker format="HH:mm" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Weekday"
                    name={[name, "weekday"]}
                    // name="weekday"
                    rules={[{ required: true, message: "Please select weekday!" }]}
                  >
                    <Select placeholder="Choose day" options={WEEKDAYS} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Room"
                    name={[name, "room"]}
                    // name="room"
                    rules={[{ required: true, message: "Please select room!" }]}
                  >
                    <Select placeholder="Choose room" options={props.roomData} />
                  </Form.Item>

                  <Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </Form.Item>
                </Card>
            ))} 

              <Form.Item>
                <Button onClick={() => add()} block>
                  Add Time Slot
                </Button>
              </Form.Item>
            </Space>
            )} 
        </Form.List>
        
      </Form> */}