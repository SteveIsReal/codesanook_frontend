import {useState, useEffect} from 'react'
import {Form, Modal, TimePicker, Select, Typography} from 'antd'
import { WEEKDAYS } from '../constants/const_string';
import dayjs from 'dayjs'
import axios from 'axios';
import { URL_CLASSROOM } from '../constants/urls';
import { PATH } from '../routes/CustomRoute';
import "../styles/modal.css"

export default function editTimeModal(props){

  const [form] = Form.useForm()
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    try {
      await form.validateFields()
      const formData = form.getFieldsValue()
      setLoading(true)

      const data = {
        ...formData,
      }

      if (props.isCreateTimeSlot){
        await axios.post(URL_CLASSROOM.TIMESLOT, data)
      } else {
        await axios.patch(`${URL_CLASSROOM.TIMESLOT}${props.editTimeSlotData.id}/`, data)
      }
      
      props.closeEditTimeSlot(true)
    } catch (err) {
      props.messageApi.open({
        type: "error",
        content: err.response.data.message
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSchedule = async (weekday) => {
    const response = await axios.get(`${URL_CLASSROOM.SCHEDULE_NO_PAGINATION}&weekdays=${weekday}`)
    setSchedule(response.data.map(d => ({value: d.id, label:`${d.weekday}, ${d.start_time}-${d.end_time}`})))
  }

  useEffect(() => {
    form.resetFields()
    setSchedule([])
    if (props.editTimeSlotData){
      const formData = {
        ...props.editTimeSlotData,
        weekday: props.editTimeSlotData.schedule_object.weekday
      }
      fetchSchedule(props.editTimeSlotData.schedule_object.weekday)
      form.setFieldsValue(formData)
    }
  }, [props.isCreateTimeSlot, props.editTimeSlotData])

  return (
    <Modal 
    open={props.isCreateTimeSlot || props.editTimeSlotData} 
    onCancel={() => props.closeEditTimeSlot(false)} 
    onOk={onSubmit} 
    closeIcon={false}
    mask={{blur: true}}
    getContainer={false}
    zIndex={1001}
    title={<Typography><h3>{props.isCreateTimeSlot ? "Add" : "Edit"} time slot</h3></Typography>}
    className="modal"
    loading={loading}
    >
    <Form form={form}>
      {/* <Form.Item label="Time" name="time" rules={[{ required: true, message: "Please select time!" }]}>
        <TimePicker.RangePicker format="HH:mm" />
      </Form.Item> */}
      <Form.Item label="Weekday" name="weekday" rules={[{ required: true, message: "Please select weekday!" }]}>
        <Select placeholder="Choose day" options={WEEKDAYS} onChange={fetchSchedule}/>
      </Form.Item>
      <Form.Item label="Schedule" name="schedule" rules={[{required: true}]}>
        <Select options={schedule}/>
      </Form.Item>
      <Form.Item label="Room" name="room" rules={[{ required: true, message: "Please select room!" }]}>
        <Select placeholder="Choose room" options={props.roomData} />
      </Form.Item>
    
    </Form>
    </Modal>
  )
}