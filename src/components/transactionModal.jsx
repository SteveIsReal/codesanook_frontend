import { Modal, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import ViewTable from "./viewTable";
import { URL_MEMBER } from "../constants/urls";

export default function TransactionModal(props) {

    const [refresh, setRefresh] = useState(0)

    const col = [
        {title: "date", dataIndex : "date", key : "date"},
        {title: "time", dataIndex : "time", key : "time"},
        {title: "transaction", dataIndex: "credit", key: "credit"},
        {title: "note", dataIndex:"note", key:"note"}
    ]

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        props.studentId != null && refreshTable()
    }, [props.studentId])


    return (
    <Modal open={props.studentId} onCancel={props.closeTransactionModal} onOk={props.closeTransactionModal}>
        <ViewTable urls={`${URL_MEMBER.VIEW_CREDIT}${props.studentId}`} columns={col} refresh={refresh}/>
    </Modal>
    )
}