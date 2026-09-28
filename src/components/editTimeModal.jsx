import { useEffect, useState } from "react";
import { Button, Form, Modal, Space, Card, TimePicker, Select } from "antd";
import { useSearchParams } from "react-router";


const WEEKDAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export default function EditTimeModal(props) {
  const [form] = Form.useForm();
  const [d, setd] = useState([])

//   useEffect(() => {
useEffect(() => {
    if (props.editTimeData) {
        form.setFieldsValue({test : props.editTimeData});
    } else {
        form.resetFields();
    }
}, [props.editTimeData, form])
//   }, [props.editTimeData, form]);

  const handleFinish = (values) => {
    console.log("Validated Form Data:", values);
    // props.onCancel();
  };

  return (
    <Modal
      open={Boolean(props.editTimeData)}
      onCancel={props.onCancel}
      onOk={form.submit}
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.List name="test" >
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ width: "100%" }}>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key}>
                {/* <Card> */}
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
        
      </Form>
    </Modal>
  );
}