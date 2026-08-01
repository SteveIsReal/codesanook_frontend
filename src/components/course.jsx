import React, { use, useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Space } from "antd"
import CourseModal from "./courseModal"

export default function Course(){

    const [courseData, setCourseData] = useState([])
    const [teacherData, setTeacherData] = useState([])
    const [studentData, setStudentData] = useState([])
    const [roomData, setRoomData] = useState([])
    const [editCourseData, setEditCourseData] = useState(null)
    const [isCreateCourse, setIsCreateCourse] = useState(false)

    const fetchCourse = async () => {
        const response = await axios.get("api/classroom/course/")
        setCourseData(response.data)
    }
    
    const fetchTeacher = async () => {
        const response  = await axios.get("/api/member/teacher/")
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

    const closeModal = () => {
        setIsCreateCourse(false)
        setEditCourseData(null)
    }

    const courseColumns = [
        {title: "Name", dataIndex: "name", key:"name"},
        {title: "Teacher", dataIndex:"teacher_name", key:"teacher"},
        {title: "Students", dataIndex:"students_name", key:"students", render : (data) => (<ul> {data.map((d) => <li>{d}</li>)} </ul>)},
        {title: "Room", dataIndex:"room_name", key:"room"},
        {title: "Weekdays", dataIndex:"weekday", key:"weeksday"},
        {title: "Time", dataIndex:"start_time", key:"time", render : (_,record) => (`${record.start_time.slice(0,5)} - ${record.end_time.slice(0,5)}`)},
        {title: "Sessions", dataIndex:"max_session", key:"session", render : (_,record) => (`${record.used_session_count}/${record.max_session}`)},
        {title: "Action", render: (_, record) => (
            <Button onClick={() => {setEditCourseData({...record, time: [record.start_time, record.end_time]})}}>Edit</Button>
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

    return (
    <>
        <Space orientation="vertical" size={"middle"} style={{display:"flex"}}>
        <Button type="primary" onClick={() => setIsCreateCourse(true)}>Create</Button>
        <Table dataSource={courseData} columns={courseColumns} />
        </Space>
        <CourseModal 
        isCreateCourse={isCreateCourse}
        editCourseData={editCourseData}
        teacherData={teacherData} 
        studentData={studentData} 
        roomData={roomData} 
        closeModal={closeModal}
        />
    </>
    )
}