import React, { useEffect, useState } from "react";
import { Space,Table,Button } from "antd";
import axios from "axios";
import RoomModal from "../components/roomModal";
import ViewTable from "../components/viewTable"
import { URL_CLASSROOM } from "../constants/urls";

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
        <Space orientation="vertical" size="medium" style={{display : "flex"}}>
            <Button onClick={() => setIsCreateRoom(true)} type="primary">Add Room</Button>
            <ViewTable urls={URL_CLASSROOM.ROOM} columns={roomColumns} refresh={refresh}/>
        </Space>
    </>)
}