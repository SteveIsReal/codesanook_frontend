import { useEffect, useState } from "react";
import { Button, Form, Modal, Space, Card, TimePicker, Select, Table } from "antd";
import { useSearchParams } from "react-router";
import axios from 'axios'
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { URL_CLASSROOM } from "../constants/urls";
import EditTimeModal from "./editTimeModal";
import ViewTable from "./viewTable";


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
  const [editTimeSlotData, setEditTimeSlotData] = useState(null)
  const [isCreateTimeSlot, setIsCreateTimeSlot] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const refreshTable = () => {
    setRefresh(refresh + 1)
    props.refreshTable()
  }

  const closeEditTimeSlot = () => {
    setIsCreateTimeSlot(false)
    setEditTimeSlotData(null)
  }

  const deleteTimeSlot = async (id) => {
    await axios.delete(`${URL_CLASSROOM.TIMESLOT}${id}/`)
    refreshTable()
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
    refreshTable()
  }, [props.isViewTimeSlot, isCreateTimeSlot, editTimeSlotData])


  return (
    <>
    <EditTimeModal roomData={props.roomData} closeEditTimeSlot={closeEditTimeSlot} isCreateTimeSlot={isCreateTimeSlot} editTimeSlotData={editTimeSlotData} />
    <Modal open={props.isViewTimeSlot} footer={<Button key="back" onClick={props.onCancel}>Back</Button>} closeIcon={false} width={"75%"}>
      <Button icon={<PlusOutlined/>} onClick={() => setIsCreateTimeSlot(true)} type="dashed" block>Add time slot</Button>
      <ViewTable urls={URL_CLASSROOM.TIMESLOT} columns={timeSlotColumns} refresh={refresh}/>
    </Modal>
    </>
  );
}