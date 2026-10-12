import { useEffect, useState } from "react";
import { Button, Form, Modal, Popconfirm, Space, Tag, Flex, Typography} from "antd";
import { useSearchParams } from "react-router";
import axios from 'axios'
import { URL_CLASSROOM } from "../constants/urls";
import EditTimeModal from "./EditTimeModal";
import ViewTable from "./ViewTable";
import { EditSquare, DeleteOutlined, ModeEditOutlineOutlined, AddCircleOutlineOutlined, WarningRounded, DangerousRounded, Schedule } from "@mui/icons-material";
import "../styles/modal.css"


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
  }
  
  const closeEditTimeSlot = () => {
    setIsCreateTimeSlot(false)
    setEditTimeSlotData(null)
    props.refreshTable()
  }

  const deleteTimeSlot = async (id) => {
    await axios.delete(`${URL_CLASSROOM.TIMESLOT}${id}/`)
    refreshTable()
  }

  const timeSlotColumns = [
    {title: "Start time", dataIndex: "start_time", key: "start_time"},
    {title: "End time", dataIndex: "end_time", key:"end_time"},
    {title: "Weekday", dataIndex: "weekday", key:"weekday", render: (data) => (
      <Tag color={"#d6e3ff"} variant="solid" style={{color:"black", fontWeight: 'bold'}}>{data}</Tag>
    )},
    {title: "Room", dataIndex: "room_name", key:"room_name"},
    {title: "Action", key: "action", render: (_, record) => (
      <Space>
        <Button icon={<ModeEditOutlineOutlined fontSize="small"/>} onClick={() => setEditTimeSlotData(record)}/>
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
  }, [props.isViewTimeSlot, isCreateTimeSlot, editTimeSlotData])


  return (
    <>
    <EditTimeModal roomData={props.roomData} closeEditTimeSlot={closeEditTimeSlot} isCreateTimeSlot={isCreateTimeSlot} editTimeSlotData={editTimeSlotData} />
    <Modal 
    open={props.isViewTimeSlot} 
    footer={
      <Button key="back" onClick={props.onCancel}>
        Back
      </Button>
    } 
    closeIcon={false} 
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
      <Button 
      icon={<AddCircleOutlineOutlined fontSize="small"/>} 
      onClick={() => setIsCreateTimeSlot(true)} 
      type="dashed" 
      block
      >
        Add time slot
      </Button>
      <ViewTable urls={URL_CLASSROOM.TIMESLOT} columns={timeSlotColumns} refresh={refresh}/>
      </Flex>
    </Modal>
    </>
  );
}