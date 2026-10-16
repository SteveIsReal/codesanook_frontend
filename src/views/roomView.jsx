import React, { useEffect, useState } from "react";
import { Space,Table,Button, Typography, Flex } from "antd";
import axios from "axios";
import RoomModal from "../components/RoomModal";
import ViewTable from "../components/ViewTable"
import { URL_CLASSROOM } from "../constants/urls";
import '../styles/table.css'

export default function RoomView() {

    const [isCreateRoom, setIsCreateRoom] = useState(false)
    const [editRoomData, setEditRoomData] = useState(null)
    const [refresh, setRefresh] = useState(0)

    const roomColumns = [
        {title : 'Room name', dataIndex: "name", key:'name'},
        {title : 'Action', key:'room_date', render : (_, record) => (
            <Button onClick={() => setEditRoomData(record)}>Edit</Button>
        )},
    ]

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        refreshTable()
    }, [])

    return (<>

        <RoomModal isCreateRoom={isCreateRoom} editRoomData={editRoomData} onCancel={() => {setEditRoomData(null);setIsCreateRoom(false)}} refreshTable={refreshTable}/>
        <Flex align="center" justify="space-between" className="card">
            <Typography.Title>Classroom</Typography.Title>
            <Button onClick={() => setIsCreateRoom(true)} type="primary" size="large">Add Room</Button>
        </Flex>
        <Space orientation="vertical" size="medium" style={{display : "flex"}} className="card">
            <ViewTable urls={URL_CLASSROOM.ROOM} columns={roomColumns} refresh={refresh}/>
        </Space>
    </>)
}