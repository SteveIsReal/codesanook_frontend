import React, { useEffect, useState } from "react";
import { Space,Table,Button } from "antd";
import axios from "axios";

export default function Room() {

    const [roomData, setRoomData] = useState([])

    const roomColumns = [
        {title : 'Room name', dataIndex: "name", key:'name'},
        {title : 'Action', key:'room_date', render : (_, record) => (
            <Button onClick={() => record}>Edit</Button>
        )},
    ]

    const fetchRoom = async () => {
        const response = await axios.get("api/classroom/room/")
        setRoomData(response.data)
    }

    useEffect(() => {
        fetchRoom()
    }, [])

    return (<>
        <Space orientation="vertical" size="medium" style={{display : "flex"}}>
            <Button onClick={() => 1} type="primary">Add Room</Button>
            <Table dataSource={roomData} columns={roomColumns}/>
        </Space>
    </>)
}