import { Form, TimePicker, Card, Select, Button } from "antd";
import axios from "axios"
import { CloseOutlined } from "@ant-design/icons";


// forwardRef(), useRef(), useImperativeHandle()
export default function TimeCard(props){

    const [form] = Form.useForm()
    
    const Sub = () => {
        const x = Form.useFormInstance()
        return form.setFieldsValue(props.data)
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


    const selfDelete = () => {
        props.deleteTime(props.data.id)
    }
    
    return (
    <>
    <Card>
        <Button color="danger" variant="solid" icon={<CloseOutlined />} onClick={selfDelete}/>
        <p>{props.data.id}</p>
        <Form form={form}>
            <Form.Item label="time" name="time">
                <TimePicker.RangePicker format="HH:mm"/>
            </Form.Item>
            <Form.Item label="weekday" name="weekday">
                <Select placeholder="Choose day" options={WEEKDAYS}/>
            </Form.Item>
            <Form.Item label="room" name="room">
                <Select placeholder="Choose room" options={props.roomData}/>
            </Form.Item>
        </Form>
    </Card>
    </>
    )
}