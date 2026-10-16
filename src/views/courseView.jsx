import React, { useEffect, useState } from "react"
import axios from "axios"
import { Button, Space, Typography, Tag, Flex} from "antd"
import CourseModal from "../components/CourseModal"
import ViewTimeModal from "../components/ViewTimeModal"
import { URL_CLASSROOM, URL_MEMBER } from "../constants/urls"
import ViewScheduleModal from "../components/ViewScheduleModal"
import ViewTable from "../components/ViewTable";
import Search from "antd/es/input/Search";
import "../styles/table.css"
import { AddCircleOutlineOutlined, Edit, Schedule, TableRowsOutlined, TabletOutlined } from "@mui/icons-material";
import useMessage from "antd/es/message/useMessage";

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
    const [isViewSchedule, setIsViewSchedule] = useState(false)
    const [filter, setFilter] = useState(null)
    const [messageApi, holder] = useMessage()

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
        const response = await axios.get(URL_CLASSROOM.TIMESLOT_NO_PAGINATION)
        const map_data = response.data.map(d => ({'value': d.id, 'label': `${d.schedule_object.start_time}-${d.schedule_object.end_time} on ${d.schedule_object.weekday.toLowerCase()} at ${d.room_name}`}))
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
                            {d?.schedule_object?.start_time.slice(0,5)} - {d?.schedule_object?.end_time.slice(0,5)} {d?.schedule_object?.weekday[0]}{d?.schedule_object?.weekday?.slice(1).toLowerCase()}
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

    return (
    <>
        {holder}
        <Flex vertical size={"middle"} gap={"medium"} className="card">
            <Flex style={{justifyContent: "space-between", alignItems: "center"}}>
                <Typography.Title>Course</Typography.Title>
                <Flex gap={"small"}>
                    <Button onClick={() => setIsViewSchedule(true)} icon={<TableRowsOutlined fontSize="small" />} size="large">Schedule</Button>
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
        <ViewTimeModal refreshTable={refreshTable} roomData={roomData} isViewTimeSlot={isViewTimeSlot} onCancel={closeTimeModal} messageApi={messageApi}/>
        <ViewScheduleModal refreshTable={refreshTable} isViewSchedule={isViewSchedule} onCancel={() => setIsViewSchedule(false)} messageApi={messageApi}/>
        
    </>
    )
}