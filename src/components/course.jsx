import React, { useEffect, useState } from "react"
import axios from "axios"
import { Table, Button } from "antd"

export default function Course(){

    const [courseData, setCourseData] = useState([])

    const fetchCourse = async () => {
        const response = await axios.get("api/classroom/course/")
        setCourseData(response.data)
    }

    const courseColumns = [
        {title: "Name", dataIndex: "name", key:"name"},
        {title: "Teacher", dataIndex:"teacher", key:"teacher"},
        {title: "Students", dataIndex:"students", key:"students", render : (data) => (<ul> {data.map((d) => <li>{d}</li>)} </ul>)},
        {title: "Weekdays", dataIndex:"weekday", key:"weeksday"},
        {title: "Time", dataIndex:"start_time", key:"time", render : (_,record) => (`${record.start_time.slice(0,5)} - ${record.end_time.slice(0,5)}`)},
        {title: "Sessions", dataIndex:"max_session", key:"session", render : (_,record) => (`${record.used_session_count}/${record.max_session}`)},
    ]

    useEffect(() => {
        fetchCourse()
    }, [])

    return (
    <>
        <Table dataSource={courseData} columns={courseColumns} />
    </>
    )
}