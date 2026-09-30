import React, { Children, use, useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Space } from "antd"
import CourseModal from "./courseModal"
import ViewTimeModal from "./viewTimeModal"
import dayjs from "dayjs"
import { URL_CLASSROOM, URL_MEMBER } from "../constants/urls"
import SelectTimeModal from "./selectTimeModal";

export default function Course(){

    const [courseData, setCourseData] = useState([])
    const [teacherData, setTeacherData] = useState([])
    const [studentData, setStudentData] = useState([])
    const [roomData, setRoomData] = useState([])
    const [curriculum, setCurriculum] = useState([])
    const [timeSlotTableData, setTimeSlotTableData] = useState([])
    const [editCourseData, setEditCourseData] = useState(null)
    const [editTimeData, setEditTimeData] = useState(null)
    const [isCreateCourse, setIsCreateCourse] = useState(false)
    const [isViewTimeSlot, setIsViewTimeSlot] = useState(false)

    const fetchCourse = async () => {
        const response = await axios.get(URL_CLASSROOM.COURSE)
        setCourseData(response.data)
    }
    
    const fetchTeacher = async () => {
        const response  = await axios.get(URL_MEMBER.TEACHER)
        const map_data = response.data.map(d => ({'value': d.id, 'label': d.first_name}))
        setTeacherData(map_data)
    }

    const fetchStudent = async () => {
        const response = await axios.get(URL_MEMBER.STUDENT_REGISTERED)
        const map_data = response.data.map(d => ({'value': d.id, 'label': d.name}))
        setStudentData(map_data)
    }

    const fetchRoom = async () => {
        const response = await axios.get(URL_CLASSROOM.ROOM)
        const map_data = response.data.map(d => ({'value': d.id, 'label': d.name}))
        setRoomData(map_data)
    }

    const fetchCurriculum = async () => {
        const response = await axios.get(URL_CLASSROOM.CURRICULUM)
        const map_data = response.data.map(d => ({'value': d.id, 'label': d.name}))
        setCurriculum(map_data) 
    }

    const fetchTimeSlot = async () => {
        const response = await axios.get(URL_CLASSROOM.TIMESLOT)
        const map_data = response.data.map(d => ({'value': d.id, 'label': `${d.start_time}-${d.end_time} on ${d.weekday.toLowerCase()} at ${d.room_name}`}))
        setTimeSlotTableData(map_data)
    }

    const closeCourseModal = () => {
        setIsCreateCourse(false)
        setEditCourseData(null)
    }

    const closeTimeModal = () => {
        setIsViewTimeSlot(false)
    }

    const courseColumns = [
        {title: "Name", dataIndex: "name", key:"name", },
        {title: "Teacher", dataIndex:"teacher_name", key:"teacher"},
        {title: "Students", dataIndex:"students_name", key:"students", render : (data) => (<ul> {data.map((d) => <li>{d}</li>)} </ul>)},
        {title: "Curriculum", dataIndex:"curriculum_name", key:"curriculum" },
        {title: "Time Slots",dataIndex:"display_time_slot", key:"time_slots", 
        render : (data) => (
            <ul> 
                {data.map((d) => <li>{d}</li>)}
            </ul>
        )},
        {title: "Sessions", dataIndex:"max_session", key:"session", render : (_,record) => (`${record.used_session_count}/${record.max_session}`)},
        {title: "Action", render: (_, record) => (
            <Space orientation="vertical">
            <Button onClick={() => {setEditCourseData(record)}}>Edit Data</Button>
            {/* <Button onClick={() => {setEditTimeData(record.time_slots.map(value => ({...value, time:[dayjs(value.start_time, "HH:mm:ss"), dayjs(value.end_time, "HH:mm:ss")]})))}}>Edit Time</Button> */}
            </Space>
        )}
    ]

    useEffect(() => {
        fetchCourse()
        fetchTeacher()
        fetchStudent()
        fetchRoom()
        fetchCurriculum()
        fetchTimeSlot()
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
        <Button type="primary" onClick={() => setIsViewTimeSlot(true)}>View Time Slot</Button>
        <Table dataSource={courseData} columns={courseColumns} bordered/>
        </Space>
        <CourseModal 
        isCreateCourse={isCreateCourse}
        editCourseData={editCourseData}
        teacherData={teacherData} 
        studentData={studentData} 
        roomData={roomData} 
        timeSlotData={timeSlotTableData}
        closeModal={closeCourseModal}
        curriculum={curriculum}
        />
        <ViewTimeModal fetchCourse={fetchCourse}roomData={roomData} isViewTimeSlot={isViewTimeSlot} onCancel={closeTimeModal}/>
        
    </>
    )
}