import { Button, Input } from "antd";
import { useState, useEffect } from "react"
import { URL_CLASSROOM } from "../constants/urls";
import { PlusCircleOutlined } from "@ant-design/icons";
import SessionHistoryModal from "../components/sessionHistoryModal";
import ViewTable from "../components/viewTable";

export default function AttendanceView() {

  const [refresh, setRefresh] = useState(0)
  const [filter, setFilter] = useState(null)
  const [courseSessionData, setCourseSessionData] = useState(null)

  const closeModal = () => {
    setCourseSessionData(null)
  }

  const refreshTable = () => {
    setRefresh(refresh + 1)
  }

  const onSearch = (value, _e, info) => {
    setFilter(`name=${value}`)
    refreshTable()
  }

  const courseColumn = [
    {title: "Name", dataIndex: "name", key:"name"},
    {title: "Curriculum", dataIndex: "curriculum_name", key:"curriculum"},
    {title: "Time slot", dataIndex: "display_time_slot", render: (data) => (
      <ul>
        {data.map(d => (<li>{d}</li>))}
      </ul>
    )},
    {title: "Students", dataIndex: "students_obj", render: (data) => (
      <ul>
        {data.map(d => (<li>{d.name}</li>))}
      </ul>
    )},
    {title: "Sessions", dataIndex:"max_session", key:"session", render : (_,record) => (
      `${record.used_session_count}/${record.max_session}`
    )},
    {title: "Action", render: (_, record) => (
      <>
      <Button onClick={() => setCourseSessionData(record)} icon={<PlusCircleOutlined/>}>Attendance</Button>
      </>
    )}
  ]

  useEffect(() => {
    refreshTable()
  }, [])

  useEffect(() => {
    console.log(courseSessionData)
  }, [courseSessionData])
  
  return (
    <>
    <SessionHistoryModal sessionData={courseSessionData} closeModal={closeModal}/>
    <h1>Attendance</h1> 
    <Input.Search placeholder="Search course" onSearch={onSearch} />
    <ViewTable urls={`${URL_CLASSROOM.COURSE}?${filter ?? ""}`} columns={courseColumn} refresh={refresh} search={true}/>
    </>
  )
}