import { useEffect, useState } from "react";
import { Button, Form, Modal, Space, Card, TimePicker, Select, Table } from "antd";
import { useSearchParams } from "react-router";
import axios from 'axios'
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";


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

  const fetchTimeSlot = async () => {
    const response = await axios.get("/api/classroom/time_slot/")
    console.log(response.data)
    setTimeSlotData(response.data)
  }

  const handleFinish = (values) => {
    console.log("Validated Form Data:", values);
  };

  const timeSlotColumns = [
    {title: "Start time", dataIndex: "start_time", key: "start_time"},
    {title: "End time", dataIndex: "end_time", key:"end_time"},
    {title: "Weekday", dataIndex: "weekday", key:"weekday"},
    {title: "Room", dataIndex: "room_name", key:"room_name"},
    {title: "Action", key: "action", render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined/>} onClick={() => 0}/>
        <Button icon={<DeleteOutlined/>} onClick={() => 0} danger/>
      </Space>
    )}
  ]
  
  // useEffect(() => {
  //     if (props.editTimeData) {
  //         form.setFieldsValue({test : props.editTimeData});
  //     } else {
  //         form.resetFields();
  //     }
  // }, [props.editTimeData, form])

  useEffect(() => {
    fetchTimeSlot()
  }, [props.isViewTimeSlot])


  return (
    <Modal open={props.isViewTimeSlot} onCancel={props.onCancel} onOk={form.submit} closeIcon={false} width={"75%"}>
      <Button icon={<PlusOutlined/>} onClick={() => 0} type="dashed" block>Add time slot</Button>
      <Table dataSource={timeSlotData} columns={timeSlotColumns} />
    </Modal>
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