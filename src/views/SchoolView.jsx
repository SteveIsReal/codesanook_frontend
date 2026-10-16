import { useState } from "react";
import { Button, Flex, Popconfirm, Typography, } from 'antd';
import ViewTable from "../components/ViewTable";
import { URL_MEMBER } from "../constants/urls";
import { AddCircleOutlineOutlined, Delete, DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import SchoolModal from "../components/SchoolModal";
import axios from "axios";

export default function SchoolView() {

  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [editSchoolData, setEditSchoolData] = useState(null)
  const [isCreateSchool, setIsCreateSchool] = useState(false)

  const refreshTable = () => {
    setRefresh(refresh + 1)
  }

  const onCancel = (update = false) => {
    setEditSchoolData(null)
    setIsCreateSchool(false)
    update && refreshTable()
  }

  const onDelete = async (record) => {
    try {
      const response = await axios.delete(`${URL_MEMBER.SCHOOL}${record.id}/`)
      refreshTable()
    } catch (err) {
      console.error(err)
    }
  }

  const schoolColumn = [
    {title: "Name", dataIndex: "name"},
    {title:"Action", width:'10%', render: (_, record) => (
      <Flex gap={"medium"}>
      <Button icon={<EditOutlined/>} onClick={() => setEditSchoolData(record)}/>
      <Popconfirm title="Delete this school" description="This action can't be reverse" onConfirm={() => onDelete(record)} placement="topLeft">
        <Button icon={<DeleteOutlineOutlined/>} danger />
      </Popconfirm>
      </Flex>
    )}
  ]
  
  return (
    <>
    <Flex vertical size={"middle"} gap={"medium"} className="card">
      <Flex style={{justifyContent: "space-between", alignItems: "center"}}>
        <Typography.Title>School</Typography.Title>
        <Flex gap={"small"}>
          <Button onClick={() => setIsCreateSchool(true)} icon={<AddCircleOutlineOutlined fontSize="small"/>} size="large" type="primary">
            Create Course
          </Button>
        </Flex>
      </Flex>
    </Flex>
    <SchoolModal editSchoolData={editSchoolData} isCreateSchool={isCreateSchool} onCancel={onCancel}/>
    <Flex vertical className="card">
    <ViewTable urls={URL_MEMBER.SCHOOL} columns={schoolColumn} refresh={refresh} loading={loading}/>
    </Flex>
    </>
  )
}