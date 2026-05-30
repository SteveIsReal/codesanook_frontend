import React from "react";
import axios from 'axios'
import TeacherModal from "./teacherModal";
import { Table, Button, Space } from "antd"
import { useState, useEffect } from "react"

export default function Teacher(){

    const [teacherData, setTeacherData] = useState([])
    const [editData, setEditData] = useState(null)
    const [isAddTeacher, setIsAddTeacher] = useState(false)

    const fetchTeacher = async () => {
        const response  = await axios.get("/api/member/teacher/")
        setTeacherData(response.data)
        console.log(response.data)
    }

    useEffect(() => {
        fetchTeacher()
    }, [])

    useEffect(() => {
        console.log(`editData : ${editData}`)
    }, [editData])
    
    const teacherColumns = [
        {title : 'First Name', dataIndex: "first_name", key:'first_name'},
        {title : 'Last Name', dataIndex: "last_name", key:'last_name'},
        {title : 'Email', dataIndex: "email", key:'email'},
        {title : 'Action', key:'email', render : (_, record) => (
            <Button onClick={() => setEditData(record)}>Edit</Button>
        )},
    ]

    return (
        <>
        <h1>Teachers</h1>
        <h3>Total : {teacherData.length}</h3>

        <TeacherModal onSuccess={() => {setIsAddTeacher(false); setEditData(null); fetchTeacher()}} isAddTeacher={isAddTeacher} editData={editData} setEditData={setEditData} setIsAddTeacher={setIsAddTeacher}/>
        
        <Space orientation="vertical" size="medium" style={{display : "flex"}}>
            <Button onClick={() => setIsAddTeacher(true)} type="primary">Add Teacher</Button>
            <Table dataSource={teacherData} columns={teacherColumns}/>
        </Space>
        
        </>
    )

}