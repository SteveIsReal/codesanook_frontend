import { Modal, Table, Space, Typography } from "antd"
import React, { useEffect, useState } from "react"
import ViewTable from "./ViewTable";
import { URL_MEMBER } from "../constants/urls";
import "../styles/modal.css"
import { SwapHorizOutlined } from "@mui/icons-material";

export default function TransactionModal(props) {

    const [refresh, setRefresh] = useState(0)
    const [resetPage, setResetPage] = useState(0)

    const col = [
        {title: "date", dataIndex : "date", key : "date"},
        {title: "time", dataIndex : "time", key : "time"},
        {title: "transaction", dataIndex: "credit", key: "credit"},
        {title: "note", dataIndex:"note", key:"note", width:"20%"}
    ]

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        props.studentId != null && refreshTable()
    }, [props.studentId])


    return (
    <Modal 
    open={props.studentId} 
    onCancel={() => {props.closeTransactionModal(); setResetPage(resetPage + 1)}} 
    onOk={props.closeTransactionModal}
    getContainer={false}
    mask={{blur: true}}
    width={"75%"}
    destroyOnHidden
    className="modal"
    title={(
        <Space>
        <Space className={"icon"}>
            <SwapHorizOutlined/>
        </Space>
        <Typography className={"modal-header"}>
            Transaction History
        </Typography>
        </Space>
    )}
    >
        <ViewTable urls={`${URL_MEMBER.VIEW_CREDIT}${props.studentId}`} resetPage={resetPage} columns={col} refresh={refresh}/>
    </Modal>
    )
}