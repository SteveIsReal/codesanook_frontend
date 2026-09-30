import React, { Children, use, useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Space } from "antd"
import CourseModal from "./courseModal"
import EditTimeModal from "./editTimeModal"
import dayjs from "dayjs"
import { URL_MEMBER } from "../constants/strings"

export default function Course(){

    const [courseData, setCourseData] = useState([])
    const [teacherData, setTeacherData] = useState([])
    const [studentData, setStudentData] = useState([])
    const [roomData, setRoomData] = useState([])
    const [editCourseData, setEditCourseData] = useState(null)
    const [editTimeData, setEditTimeData] = useState(null)
    const [isCreateCourse, setIsCreateCourse] = useState(false)

    const fetchCourse = async () => {
        const response = await axios.get("api/classroom/course/")
        setCourseData(response.data)
    }
    
    const fetchTeacher = async () => {
        const response  = await axios.get(URL_MEMBER.TEACHER)
        const map_data = response.data.map(d => ({'value': d.id, 'label': d.first_name}))
        setTeacherData(map_data)
    }

    const fetchStudent = async () => {
        const response = await axios.get("/api/member/student/")
        const map_data = response.data.map(d => ({'value': d.id, 'label': d.name}))
        setStudentData(map_data)
    }

    const fetchRoom = async () => {
        const response = await axios.get("/api/classroom/room/")
        const map_data = response.data.map(d => ({'value': d.id, 'label': d.name}))
        setRoomData(map_data)
    }

    const closeCourseModal = () => {
        setIsCreateCourse(false)
        setEditCourseData(null)
    }

    const closeTimeModal = () => {
        setEditTimeData(null)
    }

    const courseColumns = [
        {title: "Name", dataIndex: "name", key:"name", },
        {title: "Teacher", dataIndex:"teacher_name", key:"teacher"},
        {title: "Students", dataIndex:"students_name", key:"students", render : (data) => (<ul> {data.map((d) => <li>{d}</li>)} </ul>)},
        {title: "Time Slots",dataIndex:"time_slots", key:"time_slots", 
        render : (data) => (
            <ul> 
                {data.map((d) => <li>{d.start_time}-{d.end_time} on {d.weekday.toLowerCase()} at {d.room_name}</li>)}
            </ul>
        )},
        {title: "Sessions", dataIndex:"max_session", key:"session", render : (_,record) => (`${record.used_session_count}/${record.max_session}`)},
        {title: "Action", render: (_, record) => (
            <Space orientation="vertical">
            <Button onClick={() => {setEditCourseData(record)}}>Edit Data</Button>
            <Button onClick={() => {setEditTimeData(record.time_slots.map(value => ({...value, time:[dayjs(value.start_time, "HH:mm:ss"), dayjs(value.end_time, "HH:mm:ss")]})))}}>Edit Time</Button>
            </Space>
        )}
    ]

    useEffect(() => {
        fetchCourse()
        fetchTeacher()
        fetchStudent()
        fetchRoom()
    }, [])

    useEffect(() => {
        fetchCourse()
        console.log(editCourseData)
    }, [isCreateCourse, editCourseData])

    useEffect(() => {
        console.log(editTimeData)
    }, [editTimeData])

    return (
    <>
        <Space orientation="vertical" size={"middle"} style={{display:"flex"}}>
        <Button type="primary" onClick={() => setIsCreateCourse(true)}>Create</Button>
        <Table dataSource={courseData} columns={courseColumns} bordered/>
        </Space>
        <CourseModal 
        isCreateCourse={isCreateCourse}
        editCourseData={editCourseData}
        teacherData={teacherData} 
        studentData={studentData} 
        roomData={roomData} 
        closeModal={closeCourseModal}
        />
        <EditTimeModal roomData={roomData} editTimeData={editTimeData} onCancel={closeTimeModal}/>
        
    </>
    )
}