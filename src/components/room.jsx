import React, { useEffect, useState } from "react";
import { Space,Table,Button } from "antd";
import axios from "axios";
import RoomModal from "./roomModal";

export default function Room() {

    const [roomData, setRoomData] = useState([])
    const [isCreateRoom, setIsCreateRoom] = useState(false)
    const [editRoomData, setEditRoomData] = useState(null)

    const roomColumns = [
        {title : 'Room name', dataIndex: "name", key:'name'},
        {title : 'Action', key:'room_date', render : (_, record) => (
            <Button onClick={() => setEditRoomData(record)}>Edit</Button>
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

        <RoomModal isCreateRoom={isCreateRoom} editRoomData={editRoomData} onCancel={() => {setEditRoomData(null);setIsCreateRoom(false)}} fetchRoom={fetchRoom}/>
        <Space orientation="vertical" size="medium" style={{display : "flex"}}>
            <Button onClick={() => setIsCreateRoom(true)} type="primary">Add Room</Button>
            <Table dataSource={roomData} columns={roomColumns}/>
        </Space>
    </>)
}