import { useEffect, useState } from "react";
import { Button, Form, Modal, Space, Card, TimePicker, Select, Table } from "antd";
import axios from "axios"
import CurriculumModal from "./curriculumModal";
import { URL_CLASSROOM } from "../constants/urls";

export default function Curriculum(){

    const [curriculumData, setCurriculumData] = useState([])
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

    const fetchCurriculum = async () => {
        const response = await axios.get(URL_CLASSROOM.CURRICULUM)
        setCurriculumData(response.data)
        console.log(response.data)
    }

    const cancel = () => {
        setIsCreateCurriculum(false)
        setEditCurriculumData(null)
        fetchCurriculum()
    }

    useEffect(() => {
        fetchCurriculum()
    }, [])


    return (
    <>
        <CurriculumModal 
        editCurriculumData={editCurriculumData} 
        isCreateCurriculum={isCreateCurriculum}
        cancel={cancel}
        />
        <Space orientation="vertical" size="medium" style={{display : "flex"}}>
            <Button onClick={() => setIsCreateCurriculum(true)} type="primary">Add Curriculum</Button>
            <Table dataSource={curriculumData} columns={curriculumColumns}/>
        </Space>
    </>)
}