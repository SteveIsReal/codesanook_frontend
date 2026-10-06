import React, { Children, use, useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Space } from "antd"
import CourseModal from "../components/courseModal"
import ViewTimeModal from "../components/viewTimeModal"
import dayjs from "dayjs"
import { URL_CLASSROOM, URL_MEMBER } from "../constants/urls"
import SelectTimeModal from "../components/selectTimeModal";
import ViewTable from "../components/viewTable";

export default function CourseView(){

    const [refresh, setRefresh] = useState([])
    const [teacherData, setTeacherData] = useState([])
    const [studentData, setStudentData] = useState([])
    const [roomData, setRoomData] = useState([])
    const [curriculum, setCurriculum] = useState([])
    const [timeSlotTableData, setTimeSlotTableData] = useState([])
    const [editCourseData, setEditCourseData] = useState(null)
    const [isCreateCourse, setIsCreateCourse] = useState(false)
    const [isViewTimeSlot, setIsViewTimeSlot] = useState(false)

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }
    
    const fetchTeacher = async () => {
        const response  = await axios.get(URL_MEMBER.TEACHER)
        const map_data = response.data.results.map(d => ({'value': d.id, 'label': d.first_name}))
        setTeacherData(map_data)
    }

    const fetchStudent = async () => {
        const response = await axios.get(URL_MEMBER.STUDENT_REGISTERED)
        const map_data = response.data.results.map(d => ({'value': d.id, 'label': d.name}))
        setStudentData(map_data)
    }

    const fetchRoom = async () => {
        const response = await axios.get(URL_CLASSROOM.ROOM)
        const map_data = response.data.results.map(d => ({'value': d.id, 'label': d.name}))
        setRoomData(map_data)
    }

    const fetchCurriculum = async () => {
        const response = await axios.get(URL_CLASSROOM.CURRICULUM)
        const map_data = response.data.results.map(d => ({'value': d.id, 'label': d.name}))
        setCurriculum(map_data) 
    }

    const fetchTimeSlot = async () => {
        const response = await axios.get(URL_CLASSROOM.TIMESLOT)
        const map_data = response.data.results.map(d => ({'value': d.id, 'label': `${d.start_time}-${d.end_time} on ${d.weekday.toLowerCase()} at ${d.room_name}`}))
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
        {title: "Students", dataIndex:"students_obj", key:"students", render : (data) => (<ul> {data.map((d) => <li>{d.name}</li>)} </ul>)},
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
        refreshTable()
        fetchTeacher()
        fetchStudent()
        fetchRoom()
        fetchCurriculum()
        fetchTimeSlot()
    }, [])

    useEffect(() => {
        refreshTable()
    }, [isCreateCourse, editCourseData])

    return (
    <>
        <Space orientation="vertical" size={"middle"} style={{display:"flex"}}>
        <Button type="primary" onClick={() => setIsCreateCourse(true)}>Create</Button>
        <Button type="primary" onClick={() => setIsViewTimeSlot(true)}>View Time Slot</Button>
        <ViewTable urls={URL_CLASSROOM.COURSE} columns={courseColumns} refresh={refresh}/>
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
        <ViewTimeModal refreshTable={refreshTable} roomData={roomData} isViewTimeSlot={isViewTimeSlot} onCancel={closeTimeModal}/>
        
    </>
    )
}