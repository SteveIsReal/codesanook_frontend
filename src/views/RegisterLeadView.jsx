import { Form, Input, Select, message, Button, DatePicker, Divider, Typography, Flex, Grid, Image, Avatar } from "antd";
import PhoneInput from 'antd-phone-input';
import axios from "axios";
import { URL_CLASSROOM, URL_MEMBER } from "../constants/urls";
import { useEffect, useState } from "react";
import { GRADE, RELATIONSHIP, WEEKDAYS } from "../constants/const_string";
import dayjs from "dayjs"
import { useNavigate } from "react-router";
import { PATH } from "../routes/CustomRoute";
import logo from "../assets/logo.png"
import { UserOutlined } from "@ant-design/icons/es/icons/index";


export default function RegisterLeadForm ({leadId}) {

  const [form] = Form.useForm()
  const [schoolList, setSchoolList] = useState([])
  const [curriculum, setCurriculum] = useState([])
  const [schedule, setSchedule] = useState([])
  const navigate = useNavigate()
  const [messageApi, holder] = message.useMessage()
  const screens = Grid.useBreakpoint()

  const fetchSchool = async () => {
    const response = await axios.get(URL_MEMBER.GET_SCHOOL) 
    setSchoolList(response.data.map(d => ({value: d.id, label: d.name})))
  }

  const fetchCurriculum = async () => {
    const response = await axios.get(URL_CLASSROOM.CURRICULUM_NO_PAGINATION)
    setCurriculum(response.data.map(d => ({value: d.id, label: d.name})))
  }

  const fetchSchedule = async (weekday) => {
    console.log(weekday)
    const response = await axios.get(`${URL_CLASSROOM.SCHEDULE_NO_PAGINATION}&weekdays=${weekday}`)
    setSchedule(response.data.map(d => ({value: d.id, label: `${d.weekday}, ${d.start_time}-${d.end_time}`})))
  }

  const fetchLead = async () => {
    try{
      const response = await axios.get(`${URL_MEMBER.LEAD}${leadId}/`)
      const data = {
        ...response.data,
        birthday: dayjs(response.data.birthday),
      }
      fetchSchedule(response.data.available_day)
      form.setFieldsValue(data)
    } catch (err) {
      messageApi.open({
        type: "error",
        content: err.message
      })
    }
  }

  const onSubmit = async () => {
    try{
      await form.validateFields()
      const formData = form.getFieldsValue()
      const requestData = {
        ...formData,
        birthday: dayjs(formData.birthday).format('YYYY-MM-DD'),
      }
      console.log(requestData)
      if(leadId){
        await axios.patch(`${URL_MEMBER.LEAD}${leadId}/`, requestData) 
        navigate(`/${PATH.LEAD}`)
        
      } else {
        await axios.post(URL_MEMBER.LEAD, requestData)
        form.resetFields()
      }

      messageApi.open({
        type:"success",
        content:!leadId ? "Registered successfully" : "Updated successfully"
      })
    } catch (err) {
      console.error(err)
      messageApi.open({
        type:"error",
        content: err.message
      })
    }
  }

  useEffect(() => {
    leadId && fetchLead()
    fetchSchool()
    fetchCurriculum()
  }, [])

  return (
    <Flex gap={"small"} orientation="vertical" align="stretch" style={{width:"100%", minWidth: 0}}>
    {holder}
    {/* <Card className="card"> */}

      <Flex vertical>
        <Divider/>
        <Typography.Title style={{fontWeight: 'bold'}}>Register Form</Typography.Title>
        <Typography>Please enter information below.</Typography>
      </Flex>
    {/* </Card> */}
    <Divider/>
    <Form form={form} size={screens.xs ? "large" : "medium"}>
    {/* <Card className="card"> */}
      {/* <UserOutlined className="icon" style={{padding: 15  , fontSize: 'large', fontWeight: 'bold'}}/> */}
      <Typography><h2>Student Info</h2></Typography>
      <Form.Item label="First name" name={"first_name"} rules={[{required: true}]}>
        <Input placeholder="Enter first Name"/>
      </Form.Item>
      <Form.Item label="Last Name" name="last_name" rules={[{required : true}]}>
        <Input placeholder={"Enter last name"}/>
      </Form.Item>
      <Form.Item label="Nickname" name="nickname" rules={[{required : true}]}>
        <Input placeholder={"Enter nickname"}/>
      </Form.Item>
      <Form.Item layout="horizontal" label="School" name="school" rules={[{required : true}]}>
        <Select options={schoolList} placeholder={"Select school"} showSearch optionFilterProp={"label"}/>
      </Form.Item>
      <Form.Item label="Grade" name="grade" rules={[{required: true}]}>
        <Select options={GRADE} placeholder={"Select grade"}/>
      </Form.Item>
      <Form.Item label="Birthday" name="birthday" rules={[{required: true}]}>
        <DatePicker placeholder="YYYY-MM-DD"/>
      </Form.Item>
      <Form.Item label="Interested Course" name="interested_course" rules={[{required: true}]}>
        <Select options={curriculum} placeholder={"Can select more than one"} mode="multiple"/>
      </Form.Item>
      <Form.Item label="Available Days" name="available_day" rules={[{required: true}]}>
        <Select options={WEEKDAYS} placeholder="Select days" onChange={fetchSchedule} mode="multiple"/>
      </Form.Item>
      <Form.Item label="Available Times" name="available_schedule" rules={[{required : true}]}>
        <Select options={schedule} placeholder="Select times" mode="multiple"/>
      </Form.Item>
      <Form.Item label="Acquaint" name="acquaint" rules={[{required: true}]}>
        <Input placeholder="eg., Facebook, Instagram"/>
      </Form.Item>
      <Form.Item label="Recommender" name="recommender">
        <Input placeholder="Enter recommender"/>
      </Form.Item>
    {/* </Card> */}
    <Divider/>
    {/* <Card className="card"> */}
      {/* <Typography><h2>Parent Info</h2></Typography> */}
      <Form.Item label="First name" name="parent_first_name" rules={[{required: true}]}>
        <Input placeholder="Enter first name"/>
      </Form.Item>
      <Form.Item label="Last name" name="parent_last_name" rules={[{required: true}]}>
        <Input placeholder="Enter last name"/>
      </Form.Item>
      <Form.Item label="Relationship" name="relationship" rules={[{required: true}]}>
        <Select options={RELATIONSHIP} placeholder="Select relationship"/>
      </Form.Item>
      <Form.Item label="Career" name="career">
        <Input placeholder="Enter career"/>
      </Form.Item>
      <Form.Item label="Company" name="company">
        <Input placeholder="Enter company"/>
      </Form.Item>
      <Form.Item label="Phone No." name="phone" rules={[{required: true, type: "tel"}]}>
        <Input placeholder="xxx-xxx-xxxx" maxLength={10} minLength={9}/>
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{required: true, type: "email"}]}>
        <Input placeholder="name@example.com"/>
      </Form.Item>
      <Form.Item label="Line ID" name="id_line" rules={[{required: true}]}>
        <Input placeholder="Enter line ID"/>
      </Form.Item>
      <Divider />
      <Form.Item>
        <Flex style={{justifyContent: screens.xs ? 'flex-start' : 'stretch'}} vertical gap="small">
          <Typography>Please review your information before submit.</Typography>
          <Button type="primary" onClick={onSubmit} size="large" style={{width: screens.xs ? "100%" : "auto", alignSelf: screens.xs ? "stretch" : "flex-start"}}>Submit</Button>
        </Flex>
      </Form.Item>
    </Form>
   </Flex>
  )
}