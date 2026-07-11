import { Modal, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router"

export default function TransactionModal(props) {

    const [transaction, setTransaction] = useState([])

    const col = [
        {title: "date", dataIndex : "date", key : "date"},
        {title: "time", dataIndex : "time", key : "time"},
        {title: "transaction", dataIndex: "credit", key: "credit"},
        {title: "note", dataIndex:"note", key:"note"}
    ]

    const fetchCredit = async () => {
        console.log(props.studentId)
        const response = await axios.get(`api/member/view_credit/${props.studentId}/`)
        setTransaction(response.data)
    }

    useEffect(() => {
        props.studentId != null && fetchCredit()
    }, [props.studentId])


    return (
    <Modal open={props.studentId} onCancel={props.closeTransactionModal} onOk={props.closeTransactionModal}>
        <Table dataSource={transaction} columns={col}/>
    </Modal>
    )
}