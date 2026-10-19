import { useEffect, useState } from "react";
import { Button, Form, Modal, Popconfirm, Space, Tag, Flex, Typography, TimePicker, Select} from "antd";
import { useSearchParams } from "react-router";
import axios from 'axios'
import { URL_CLASSROOM } from "../constants/urls";
import EditTimeModal from "./EditTimeModal";
import ViewTable from "./ViewTable";
import {WEEKDAYS} from '../constants/const_string'
import {Search} from '@mui/icons-material'
import { EditSquare, DeleteOutlined, ModeEditOutlineOutlined, AddCircleOutlineOutlined, WarningRounded, DangerousRounded, Schedule } from "@mui/icons-material";
import "../styles/modal.css"
import dayjs from "dayjs"


const WEEKDAY_COLOR = {
  MONDAY: "#fffcd6",
  TUESDAY: "#ffd6fe",
  WEDNESDAY: "#d6ffe0",
  THURSDAY: "#ffebd6",
  FRIDAY: "#d6f5ff",
  SATURDAY: "#f1d6ff",
  SUNDAY: "#ffd6d6"
}

export default function ViewTimeModal(props) {
  const [form] = Form.useForm();
  const [editTimeSlotData, setEditTimeSlotData] = useState(null)
  const [isCreateTimeSlot, setIsCreateTimeSlot] = useState(false)
  const [startTimeFilter, setStartTimeFilter] = useState(null)
  const [endTimeFilter, setEndTimeFilter] = useState(null)
  const [weekdayFilter, setWeekdayFilter] = useState("")
  const [roomFilter, setRoomFilter] = useState(null)
  const [refresh, setRefresh] = useState(0)

  const refreshTable = () => {
    setRefresh(refresh + 1)
  }
  
  const closeEditTimeSlot = (update = false) => {
    setIsCreateTimeSlot(false)
    setEditTimeSlotData(null)
    update && refreshTable()
  }

  const deleteTimeSlot = async (id) => {
    await axios.delete(`${URL_CLASSROOM.TIMESLOT}${id}/`)
    refreshTable(true)
  }

  const onFilterChange = async () => {
    const formData = form.getFieldsValue()
    setStartTimeFilter(formData?.time?.[0] ? dayjs(formData.time[0]).format("HH:mm") : null)
    setEndTimeFilter(formData?.time?.[1] ? dayjs(formData.time[1]).format("HH:mm") : null)
    setWeekdayFilter(formData?.weekday)
    setRoomFilter(formData?.room)
    refreshTable()
  }

  const timeSlotColumns = [
    {title: "Start time", dataIndex: "schedule_object", key: "start_time", render: (d) => (
      <Typography>{d.start_time}</Typography>
    )},
    {title: "End time", dataIndex: "schedule_object", key:"end_time", render: (d) => (
      <Typography>{d.end_time}</Typography>
    )},
    {title: "Weekday", dataIndex: "schedule_object", key:"weekday", render: (d) => (
      <Tag color={WEEKDAY_COLOR?.[d.weekday]} variant="solid" style={{color:"black", fontWeight: 'bold'}}>{d.weekday}</Tag>
    )},
    {title: "Room", dataIndex: "room_name", key:"room_name"},
    {title: "Action", key: "action", render: (_, record) => (
      <Space>
        <Button icon={<ModeEditOutlineOutlined fontSize="small"/>} onClick={() => {setEditTimeSlotData(record); console.log(record)}}/>
        <Popconfirm
        title="Delete time"
        description="This will effect your existed course."
        onConfirm={() => deleteTimeSlot(record.id)}
        icon={<DangerousRounded fontSize="small" style={{color: 'red', marginRight: 4}}/>}
        >
          <Button icon={<DeleteOutlined fontSize="small"/>} danger/>
        </Popconfirm>
      </Space>
    )}
  ]
  
  useEffect(() => {
    refreshTable()
    form.resetFields()
  }, [props.isViewTimeSlot])


  return (
    <>
    <EditTimeModal 
    roomData={props.roomData} 
    closeEditTimeSlot={closeEditTimeSlot} 
    isCreateTimeSlot={isCreateTimeSlot} 
    editTimeSlotData={editTimeSlotData} 
    messageApi={props.messageApi}
    />
    <Modal 
    open={props.isViewTimeSlot} 
    footer={
      <Button key="back" onClick={props.onCancel}>
        Back
      </Button>
    } 
    onCancel={props.onCancel}
    getContainer={false} 
    width={"75%"} 
    mask={{blur: true}} 
    destroyOnHidden
    title={
      <Flex align="center" gap={"small"}>
        <Schedule fontSize="large" />
        <Typography.Title>Time Table</Typography.Title>
      </Flex>
    }
    className="modal"
    >
      <Flex vertical gap="small">
        <Flex gap="small">
          <Button 
          icon={<AddCircleOutlineOutlined fontSize="small"/>} 
          onClick={() => setIsCreateTimeSlot(true)} 
          type="dashed" 
          block
          >
            Time slot
          </Button>
        </Flex>
        <Form form={form}>
        <Flex gap="small" justify="strecth" align="center">
          <Form.Item>
            <Typography style={{whiteSpace: "nowrap"}}>Filters : </Typography>
          </Form.Item>
          <Form.Item name="time" style={{width:"100%"}}>
            <TimePicker.RangePicker style={{width:"100%"}} format={"HH:mm"}/>
          </Form.Item>
          <Form.Item name="weekday" style={{width:"100%"}}>
            <Select style={{width:"100%"}} options={WEEKDAYS} placeholder="Select weekday" allowClear/>
          </Form.Item>
          <Form.Item name="room" style={{width: "50%"}}>
            <Select options={props.roomData} allowClear placeholder="Select room"/>
          </Form.Item>
          <Form.Item>
            <Button icon={<Search/>} onClick={onFilterChange}/>
          </Form.Item>
        </Flex>
        </Form>
      <ViewTable urls={`${URL_CLASSROOM.TIMESLOT}?weekday=${weekdayFilter ?? ""}&start_time=${startTimeFilter ?? ""}&end_time=${endTimeFilter ?? ""}&room=${roomFilter ?? ""}`} columns={timeSlotColumns} refresh={refresh} search={true}/>
      </Flex>
    </Modal>
    </>
  );
}