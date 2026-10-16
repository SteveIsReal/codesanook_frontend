import { unstable_useCacheRefresh, useEffect, useState } from "react";
import { Button, Form, Modal, Space, Card, TimePicker, Select, Table, Flex, Typography } from "antd";
import axios from "axios"
import CurriculumModal from "../components/CurriculumModal";
import { URL_CLASSROOM } from "../constants/urls";
import ViewTable from "../components/ViewTable";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import '../styles/table.css'

export default function CurriculumView(){

    const [curriculumData, setCurriculumData] = useState([])
    const [refresh, setRefresh] = useState(0)
    const [isCreateCurriculum, setIsCreateCurriculum] = useState(false)
    const [editCurriculumData, setEditCurriculumData] = useState(null)

    const curriculumColumns = [
        {title: "name", dataIndex: "name", key: "name"},
        {title: "action", key: "action", render : (_, record) => (
            <>
            <Button onClick={() => {setEditCurriculumData(record); console.log(record)}}>Edit</Button>
            </>
        )}
    ]

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }

    const cancel = () => {
        setIsCreateCurriculum(false)
        setEditCurriculumData(null)
        refreshTable()
    }

    useEffect(() => {
        refreshTable()
    }, [])


    return (
    <>
        <CurriculumModal 
        editCurriculumData={editCurriculumData} 
        isCreateCurriculum={isCreateCurriculum}
        cancel={cancel}
        />
        <Flex align="center" justify="space-between" className="card">
            <Typography.Title>Curriculum</Typography.Title>
            <Button onClick={() => setIsCreateCurriculum(true)} type="primary" size="large" icon={<AddCircleOutlineOutlined/>}>Curriculum</Button>
        </Flex>
        <Space orientation="vertical" size="medium" style={{display : "flex"}} className="card">
            <ViewTable urls={URL_CLASSROOM.CURRICULUM} columns={curriculumColumns} refresh={refresh}/>
        </Space>
    </>)
}