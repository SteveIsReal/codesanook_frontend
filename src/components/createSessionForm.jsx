import { Button, Col, DatePicker, Flex, Form, Input, Row, Select, Space, Table, Typography } from "antd";
import { useState, useEffect, Fragment } from "react"
import axios, { create } from 'axios'
import { URL_CLASSROOM } from "../constants/urls";
import { PRESENT_OPTIONS } from "../constants/const_string";
import { PATH } from "../routes/customRoute"
import dayjs from "dayjs";
import { useNavigate } from "react-router";

export default function CreateSessionForm({courseId, sessionId, sessionForm}){

  const navigate = useNavigate()
  const [subjectData, setSubjectData] = useState([])
  const [timeSlotData, setTimeSlotData] = useState([])
  const [courseData, setCourseData] = useState(null)
  const DisplayText = ({value}) => <Typography>{value}</Typography>

  const fetchSubject = async () => {
    const response = await axios.get(`${URL_CLASSROOM.COURSE}${courseId}/curriculum/`)
    setSubjectData(response.data.subjects.map(
      d => ({label: d.topic, value: d.id})
    ))
  }

  const fetchCourse = async () => {
    const response = await axios.get(`${URL_CLASSROOM.COURSE}${courseId}/`)
    setCourseData(response.data)
  }

  const fetchSession = async () => {
    const response = await axios.get(`${URL_CLASSROOM.SESSION}${sessionId}/`)
    const r = response.data
    sessionForm.setFieldsValue(
      {...r, 
      session_date: dayjs(r.session_date), 
      students:r.students_info.map(({student_obj, ...d}) => ({
        id: student_obj.id, 
        name: student_obj.name, 
        status: d.status,
        comment: d.comment}))
      })
  }

  const onSubmit = async () => {
    const validate = await sessionForm.validateFields()
    const formData = sessionForm.getFieldsValue()
    const requestData = {...formData, session_date : dayjs(formData.session_date).format("YYYY-MM-DD"), course: courseId}
    console.log(requestData)
    const response = sessionId === "create" ? 
      await axios.post(URL_CLASSROOM.SESSION, requestData) :
      await axios.put(`${URL_CLASSROOM.SESSION}${sessionId}/`, {...requestData, id:sessionId}) 
    sessionForm.resetFields()
    navigate(`/${PATH.ATTENDANCE}`)
  }

  useEffect(() => {
    fetchSubject()
    fetchCourse()
  }, [])

  useEffect(() => {
    if (courseData){
      setTimeSlotData(courseData.time_slots.map((d, index) => ({
        label: courseData.display_time_slot[index],
        value: d,
      })))

      sessionForm.resetFields()
      if (sessionId !== "create"){
        fetchSession()
      } else {
        sessionForm.setFieldsValue({
          students: courseData.students_obj.map(s => ({ id: s.id, name: s.name })),
        })
      }
    }
  }, [courseData])

  return (
    <Form form={sessionForm} layout="vertical">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 28 }}>
        <Form.Item label="Subject" name={"subject"} rules={[{required:true, message:"Please select subject"}]}>
          <Select placeholder={"Select subject"} options={subjectData}/>
        </Form.Item>
        <Form.Item label="Time slot" name={"time_slot"} rules={[{required: true, message:"Please select time slot"}]}>
          <Select placeholder={"Select time slot"} options={timeSlotData} />
        </Form.Item>
        <Form.Item label="Session date" name={"session_date"} rules={[{required: true, message:"Please choose session date"}]}>
          <DatePicker />
        </Form.Item>
      </div>

      <Row style={{ fontWeight: 'bold', padding: '1rem' }} gutter={[16, 16]}>
        <Col span={8}>name</Col>
        <Col span={8} align='center'>status</Col>
        <Col span={8} align='right'>feedback</Col>
      </Row>

      <Form.List name="students">
        {(fields) => (
          
          <>
          <Row style={{width:'100%'}}>
            {fields.map(({ key, name,  ...restField}) => {
              return (
              <Fragment key={key}>
                {/* Student Name */}
                <Col span={8}>
                <Form.Item {...restField} name={[name, "id"]} hidden />
                <Form.Item {...restField} name={[name, "name"]}>
                  <DisplayText />
                </Form.Item>
                </Col>

                <Col span={8} align="center">
                <Form.Item {...restField} name={[name, "status"]} rules={[{required: true, message: "Please select status",}]}>
                  <Select placeholder="Select status" options={PRESENT_OPTIONS} style={{ width: 150 }}/>
                </Form.Item>
                </Col>

                <Col span={8}>
                <Form.Item {...restField} name={[name, "comment"]} rules={[{required: true, message: "Please add comment"}]}>
                  <Input.TextArea placeholder="Comment" rows={1} />
                </Form.Item>
                </Col>
              </Fragment>
            )})}
          </Row>
          </>
        )}
      
      </Form.List>

      <Form.Item label="Session comment" name="comment" rules={[{required:true}]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button onClick={onSubmit} type="primary">Submit</Button>
      </Form.Item>
    </Form>
  )
}