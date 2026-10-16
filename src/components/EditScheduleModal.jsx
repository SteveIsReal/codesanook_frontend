import { Form, Modal, TimePicker, Typography, Select, message } from "antd";
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import axios from "axios";
import { URL_CLASSROOM } from "../constants/urls";
import {WEEKDAYS} from '../constants/const_string'

export default function EditScheduleModal ({closeEditSchedule, isCreateSchedule, editScheduleData, messageApi}) {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    try{
      await form.validateFields()
      const formData = form.getFieldsValue()
      const data = {
        ...formData,
        start_time: dayjs(formData.time?.[0]).format("HH:mm"),
        end_time: dayjs(formData.time?.[1]).format("HH:mm")
      }

      isCreateSchedule ? await axios.post(URL_CLASSROOM.SCHEDULE, data) :
      await axios.patch(`${URL_CLASSROOM.SCHEDULE}${editScheduleData.id}/`, data)
      closeEditSchedule(true)
    } catch (err) {
      messageApi.open({
        type: "error",
        content: err?.response?.data?.message
      })
    }

  }

  useEffect(() => {
    form.resetFields()
    if (editScheduleData) {
      const data = {
        ...editScheduleData,
        time : [
          dayjs(editScheduleData.start_time, "HH:mm"),
          dayjs(editScheduleData.end_time, "HH:mm")
        ]
      }
      form.setFieldsValue(data)
    }

  }, [isCreateSchedule, editScheduleData])

  return (
    <Modal 
    open={isCreateSchedule || editScheduleData}
    onCancel={() => closeEditSchedule(false)} 
    onOk={onSubmit} 
    closeIcon={false}
    mask={{blur: true}}
    getContainer={false}
    zIndex={1001}
    destroyOnHidden
    title={<Typography><h3>{isCreateSchedule ? "Add" : "Edit"} schedule</h3></Typography>}
    className="modal"
    loading={loading}
    >
      <Form form={form}>
        <Form.Item label="Time" name="time" rules={[{required: true}]}>
          <TimePicker.RangePicker format={"HH:mm"} />
        </Form.Item>
        <Form.Item label="Weekday" name="weekday" rules={[{required: true}]}>
          <Select options={WEEKDAYS} placeholder="Select weekday"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}