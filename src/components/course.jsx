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
        {title: "Students", dataIndex:"students", key:"students"},
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