import React, { Children, use, useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Space, Typography, Tag, Flex} from "antd"
import CourseModal from "../components/CourseModal"
import ViewTimeModal from "../components/ViewTimeModal"
import dayjs from "dayjs"
import { URL_CLASSROOM, URL_MEMBER } from "../constants/urls"
import SelectTimeModal from "../components/SelectTimeModal";
import ViewTable from "../components/ViewTable";
import Search from "antd/es/input/Search";
import "../styles/table.css"
import { AddCircleOutlineOutlined, Edit, Schedule } from "@mui/icons-material";

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
    const [filter, setFilter] = useState(null)

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }
    
    const fetchTeacher = async () => {
        const response  = await axios.get(URL_MEMBER.TEACHER)
        const map_data = response.data.results.map(d => ({'value': d.id, 'label': d.first_name}))
        setTeacherData(map_data)
    }

    const fetchStudent = async () => {
        const response = await axios.get(URL_MEMBER.STUDENT_NO_PAGINATION)
        console.log(response)
        const map_data = response.data.map(d => ({'value': d.id, 'label': d.name}))
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

    const closeCourseModal = (submit = false) => {
        setIsCreateCourse(false)
        setEditCourseData(null)
        submit && refreshTable()
    }

    const closeTimeModal = () => {
        setIsViewTimeSlot(false)
    } 

    const onSearch = (value, _e, info) => {
        setFilter(`name=${value}`)
        refreshTable()
    }

    const courseColumns = [
        {title: "Name", dataIndex: "name", key:"name", render: (data) => (
            <Typography style={{fontWeight: "bold"}}>{data}</Typography>
        )},
        {title: "Teacher", dataIndex:"teacher_name", key:"teacher", render: (data) => (
            <Tag style={{padding: 8}}>{data}</Tag>
        )},
        {title: "Students", dataIndex:"students_obj", key:"students", render : (data) => (
            <Space vertical>
                {data.length <= 3 ? 
                data.map((d) => <Tag style={{padding: "0.5vw", borderRadius:16, background: "#ebedf7"}}>{d.name}</Tag>)
                : [
                    data.slice(0,3).map((d) => <Tag style={{padding: "0.5vw", borderRadius:16, background: "#ebedf7"}}>{d.name}</Tag>), 
                    <Tag style={{padding: "0.5vw", background: "#d6e3ff", borderRadius:16, fontWeight: "bold"}}>+{data.length - 3} more</Tag>
                ]}
            </Space>
        )},
        {title: "Curriculum", dataIndex:"curriculum_name", key:"curriculum", render: (data) => (
            <Tag style={{padding: "1vw", background: "#d6e3ff", borderRadius:16, fontWeight: "bold"}}>{data}</Tag>
        )},
        {title: "Time Slots",dataIndex:"time_slot_obj", key:"time_slots", 
        render : (data) => (
            <ul>
                {data.length > 0 ? data.map((d) => <li>
                    <Flex gap="small" style={{margin:8}}>
                        <Typography.Text>
                            {d.start_time.slice(0,5)} - {d.end_time.slice(0,5)} {d.weekday[0]}{d.weekday.slice(1).toLowerCase()}
                        </Typography.Text>
                        <Tag color={"gray"}>
                            {d.room_name}
                        </Tag>
                    </Flex>
                </li>) : 
                <Flex style={{color:"gray", alignItems:"center"}} gap="small">
                    <Schedule fontSize="small"/>
                    <Typography.Text type="secondary">To be schedule</Typography.Text>
                </Flex>}
            </ul>
        )},
        {title: "Sessions", dataIndex:"max_session", key:"session", render : (_,record) => (
            <Tag
            color={record.used_session_count > record.max_session ? "red" : "green"} 
            variant="filled" 
            style={{fontWeight: "bold", padding: "0.5vw", borderRadius: "5vw"}}
            >{record.used_session_count}/{record.max_session}</Tag>
        )},
        {title: "Action", width: "5%", render: (_, record) => (
            <Space orientation="vertical">
            <Button onClick={() => {setEditCourseData(record)}} icon={<Edit fontSize="small"/>} />
            </Space>
        )}
    ]

    useEffect(() => {
        refreshTable()
    }, [])

    useEffect(() => {
        fetchTeacher()
        fetchStudent()
        fetchRoom()
        fetchCurriculum()
        fetchTimeSlot() 
    }, [refresh])

    // useEffect(() => {
    //     if (isCreateCourse || editCourseData === null){
    //         refreshTable()
    //     }
    // }, [isCreateCourse, editCourseData])

    return (
    <>
        <Flex vertical size={"middle"} gap={"medium"} className="card">
            <Flex style={{justifyContent: "space-between", alignItems: "center"}}>
                <Typography.Title>Course</Typography.Title>
                <Flex gap={"small"}>
                    <Button onClick={() => setIsViewTimeSlot(true)} icon={<Schedule fontSize="small" />} size="large">Time Slot</Button>
                    <Button onClick={() => setIsCreateCourse(true)} icon={<AddCircleOutlineOutlined fontSize="small"/>} size="large" type="primary">Create Course</Button>
                </Flex>
            </Flex>
        </Flex>
        <Flex vertical size={"middle"} gap={"medium"} className="card">
        <Search placeholder="Search course" onSearch={onSearch} />
        <ViewTable urls={`${URL_CLASSROOM.COURSE}?${filter ?? ""}`} columns={courseColumns} refresh={refresh} search={true}/>
        </Flex>
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