import { EditOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import {URL_CLASSROOM} from "../constants/urls"
import axios from 'axios'
import { useLocation, useNavigate } from "react-router";
import dayjs from "dayjs";
import ViewTable from "./viewTable";

export default function SessionHistoryModal ({sessionData, closeModal}) {

  const navigate = useNavigate()
  const [refresh, setRefresh] = useState(0)
  const [url, setUrl] = useState(null)

  const col = [
    {title: 'Session date', dataIndex: 'session_date', key: 'session_date'},
    {title: 'Topic', render: (_, r) => (r.subject_obj.topic)},
    {title: 'Action', render: (_, r) => (
    <>
      <Button 
      icon={<EditOutlined/>} 
      onClick={() => {
        navigate(`${sessionData.id}/${r.id}`)
      }}/>
    </>
    )}
  ]

  const refreshTable = () => {
    setRefresh(refresh + 1)
  }

  useEffect(() => {
    refreshTable()
  }, [])

  return (
    <Modal title="History" footer={(_) => (<></>)} open={sessionData} width={"75%"} onCancel={() => {closeModal(); refreshTable()}} >
      <Button onClick={() => navigate(`${sessionData.id}/create/`)}>Create</Button>
      <ViewTable urls={`${URL_CLASSROOM.COURSE}${sessionData?.id}/sessions/`} columns={col} refresh={refresh}/>
    </Modal>
  )
}