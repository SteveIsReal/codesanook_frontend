import React from "react";
import axios from 'axios'
import TeacherModal from "../components/TeacherModal";
import { Button, Space, Card, Typography, Flex, Tag } from "antd"
import { useState, useEffect } from "react"
import { URL_CLASSROOM, URL_MEMBER } from "../constants/urls";
import ViewTable from "../components/ViewTable";
import "../styles/table.css"

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

        <TeacherModal onSuccess={() => {setIsAddTeacher(false); setEditData(null); refreshTable()}} isAddTeacher={isAddTeacher} editData={editData} setEditData={setEditData} setIsAddTeacher={setIsAddTeacher}/>
        
        <Space orientation="vertical" size="medium" style={{display : "flex"}} className="card">
            <Flex style={{alignItems: 'center', justifyContent: 'space-between'}}>
                <Flex style={{alignItems:'center'}} gap={"medium"}>
                    <Typography.Title>Teacher</Typography.Title>
                    <Tag 
                    color="gray" 
                    style={{fontWeight: "bold", padding: "0.5vw", borderRadius: "5vw"}}
                    >
                        {totalTeacher} records
                    </Tag>
                </Flex>
            <Button onClick={() => setIsAddTeacher(true)} type="primary" size="large">Add Teacher</Button>
            </Flex>
        </Space>
        <Space orientation="vertical" style={{display: "flex"}} className="card">
            <ViewTable urls={URL_MEMBER.TEACHER} columns={teacherColumns} refresh={refresh} getCount={setTotalTeacher}/>
        </Space>
        
        </>
    )

}