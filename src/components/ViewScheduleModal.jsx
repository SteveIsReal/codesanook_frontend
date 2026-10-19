import { useEffect, useState } from "react";
import { Button, Form, Modal, Popconfirm, Space, Tag, Flex, Typography, Select, TimePicker, Divider} from "antd";
import { useSearchParams } from "react-router";
import axios from 'axios'
import { URL_CLASSROOM } from "../constants/urls";
import EditScheduleModal from "./EditScheduleModal";
import ViewTable from "./ViewTable";
import { EditSquare, DeleteOutlined, ModeEditOutlineOutlined, AddCircleOutlineOutlined, WarningRounded, DangerousRounded, Schedule, Search } from "@mui/icons-material";
import "../styles/modal.css"
import { WEEKDAYS } from "../constants/const_string";
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
  const [editScheduleData, setEditScheduleData] = useState(null)
  const [isCreateSchedule, setIsCreateSchedule] = useState(false)
  const [startTimeFilter, setStartTimeFilter] = useState(null)
  const [endTimeFilter, setEndTimeFilter] = useState(null)
  const [weekdayFilter, setWeekdayFilter] = useState("")
  const [refresh, setRefresh] = useState(0)
  const [form] = Form.useForm()

  const refreshTable = () => {
    setRefresh(refresh + 1)
  }
  
  const closeEditSchedule = (update = false) => {
    setIsCreateSchedule(false)
    setEditScheduleData(null)
    update && refreshTable()
  }

  const deleteSchedule = async (id) => {
    await axios.delete(`${URL_CLASSROOM.SCHEDULE}${id}/`)
    refreshTable(true)
  }

  const onFilterChange = async () => {
    const formData = form.getFieldsValue()
    setStartTimeFilter(formData?.time?.[0] ? dayjs(formData.time[0]).format("HH:mm") : null)
    setEndTimeFilter(formData?.time?.[1] ? dayjs(formData.time[1]).format("HH:mm") : null)
    setWeekdayFilter(formData?.weekday)
    refreshTable()
  }

  const ScheduleColumns = [
    {title: "Start time", dataIndex: "start_time", key: "start_time"},
    {title: "End time", dataIndex: "end_time", key:"end_time"},
    {title: "Weekday", dataIndex: "weekday", key:"weekday", render: (d) => (
      <Tag color={WEEKDAY_COLOR?.[d]} variant="solid" style={{color:"black", fontWeight: 'bold'}}>{d}</Tag>
    )},
    {title: "Action", key: "action", width:"10%", render: (_, record) => (
      <Space>
        <Button icon={<ModeEditOutlineOutlined fontSize="small"/>} onClick={() => {setEditScheduleData(record); console.log(record)}}/>
        <Popconfirm
        title="Delete Schedule"
        description="This will effect your existed course."
        onConfirm={() => deleteSchedule(record.id)}
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
  }, [props.isViewSchedule])


  return (
    <>
    <EditScheduleModal 
    closeEditSchedule={closeEditSchedule} 
    isCreateSchedule={isCreateSchedule} 
    editScheduleData={editScheduleData} 
    messageApi={props.messageApi}
    />
    <Modal 
    open={props.isViewSchedule} 
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
        <Typography.Title>Schedule Table</Typography.Title>
      </Flex>
    }
    className="modal"
    >
      <Flex vertical gap="small" align="stretch">
        <Flex gap="small" vertical>
          <Button 
          icon={<AddCircleOutlineOutlined fontSize="small"/>} 
          onClick={() => setIsCreateSchedule(true)} 
          type="dashed" 
          block
          >
            Schedule
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
          <Form.Item>
            <Button icon={<Search/>} onClick={onFilterChange}/>
          </Form.Item>
        </Flex>
        </Form>
      <ViewTable urls={`${URL_CLASSROOM.SCHEDULE}?weekdays=${weekdayFilter ?? ""}&start_time=${startTimeFilter ?? ""}&end_time=${endTimeFilter ?? ""}`} columns={ScheduleColumns} refresh={refresh} search={true}/>
      </Flex>
    </Modal>
    </>
  );
}