import React from "react";
import axios from 'axios'
import TeacherModal from "../components/teacherModal";
import { Table, Button, Space } from "antd"
import { useState, useEffect } from "react"
import { URL_CLASSROOM, URL_MEMBER } from "../constants/urls";
import ViewTable from "../components/viewTable";

export default function TeacherView(){

    const [editData, setEditData] = useState(null)
    const [isAddTeacher, setIsAddTeacher] = useState(false)
    const [totalTeacher, setTotalTeacher] = useState(0)
    const [refresh, setRefresh] = useState(0)

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        refreshTable()
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
        <h3>Total : {totalTeacher}</h3>

        <TeacherModal onSuccess={() => {setIsAddTeacher(false); setEditData(null); refreshTable()}} isAddTeacher={isAddTeacher} editData={editData} setEditData={setEditData} setIsAddTeacher={setIsAddTeacher}/>
        
        <Space orientation="vertical" size="medium" style={{display : "flex"}}>
            <Button onClick={() => setIsAddTeacher(true)} type="primary">Add Teacher</Button>
            <ViewTable urls={URL_MEMBER.TEACHER} columns={teacherColumns} refresh={refresh} getCount={setTotalTeacher}/>
        </Space>
        
        </>
    )

}