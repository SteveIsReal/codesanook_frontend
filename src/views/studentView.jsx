import React, { use, useEffect, useState } from "react";

import NonPaymentIcon from "@mui/icons-material/Warning"
import EditIcon from "@mui/icons-material/EditOutlined"
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import MinusIcon from "@mui/icons-material/DoNotDisturbOnOutlined"
import ViewCreditIcon from "@mui/icons-material/VisibilityOutlined"
import AddStudentIcon from "@mui/icons-material/PersonAddOutlined"

import { useSearchParams } from "react-router";
import { Space, Table, Button, Flex, Popconfirm, InputNumber, message, Input, Tag, Typography } from "antd";
import axios from "axios";
import StudentModal from "../components/LeadModal";
import TransactionModal from "../components/TransactionModal";
import { URL_MEMBER } from "../constants/urls";
import ViewTable from "../components/ViewTable";
import { flexWrapValues } from "antd/es/flex/utils";

import "../styles/table.css"

export default function StudentView(){

    const [isCreateStudent, setIsCreateStudent] = useState(false)
    const [editStudentData, setEditStudentData] = useState(null)
    const [schoolList, setSchoolList] = useState([])
    const [changeCredit, setChangeCredit] = useState(1)
    const [totalStudent, setTotalStudent] = useState(0)
    const [refresh, setRefresh] = useState(0)
    const [showTransactionModal, setShowTransactionModal] = useState(null)
    const [messageApi, holder] = message.useMessage()
    const [filter, setFilter] = useState(null)
    

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }

    const onSearch = async (value, _e, info) => {
        setFilter(`search=${value}`)
        refreshTable()
    }

    const fetchSchoolList = async () => {
        // add try catch
        const response = await axios.get(URL_MEMBER.GET_SCHOOL)
        setSchoolList(response.data.map(d => ({value: d.id, label: d.name})))
    }

    const closeTransactionModal = () =>{
        setShowTransactionModal(null)
    }

    useEffect(() => {
        fetchSchoolList()
    }, [])

    const studentColumns = [
        {title : 'Name', dataIndex: "name", key:'name', render: (data, record) => (
            <Flex gap="medium" style={{alignItems: "center"}} wrap>
            <Typography style={{fontWeight: "bold"}}>{data}</Typography>
            {record.current_credit < 0 && 
            <Tag 
            icon={<NonPaymentIcon fontSize="small" />} 
            color={"red"} variant="filled" 
            style={{alignItem : "center", padding: "0.3vw", display: "flex", borderRadius: "5vw"}}
            />}
            </Flex>
        )},
        {title : 'Course', dataIndex: "course", key:'course', width:"30%", render : (data) => (
        <Flex wrap gap="small">
            {data.map(d => (<Tag color={"gray"} variant="filled" style={{padding: "0.5vw", borderRadius: "5vw"}}>{d}</Tag>))}
        </Flex>
        )},
        {title : 'Credit', dataIndex: "current_credit", width:"10%", key:'current_credit', render : (data) => (
            <Tag 
            color={data > 0 ? "green" : data === 0 ? "default" : "red"} 
            variant="filled" 
            style={{fontWeight: "bold", padding: "0.5vw", borderRadius: "5vw"}}>
                {data} Credits
            </Tag>
        )},
        {title : 'Action', key:'email', width:'10%' ,render : (_, record) => (
            <Flex gap={"medium"}>
            <Button onClick={() => (setEditStudentData(record.lead_obj))} icon={<EditIcon />} type="text"/>
            <Popconfirm 
                title="Add credit"
                description={<InputNumber min={1} defaultValue={changeCredit} onChange={value => (setChangeCredit(value))}/>}
                onConfirm={async () => {
                    const response = await axios.post(
                        URL_MEMBER.ADD_CREDIT, 
                        {
                            student : record.id,
                            credit : changeCredit
                        } 
                    )
                    message.success("Add credit successfully!")
                    setChangeCredit(1)
                    refreshTable()
                }}
                onCancel={() => (1)}
                okText="Send"
                cancelText="Cancel">
                <Button icon={<AddIcon />} type="text"></Button>
            </Popconfirm>
            <Popconfirm 
                title="Use credit"
                description={<InputNumber min={1} defaultValue={changeCredit} onChange={value => (setChangeCredit(value))}/>}
                onConfirm={async () => {
                    const response = await axios.post(
                        URL_MEMBER.USE_CREDIT, 
                        {
                            student : record.id,
                            credit : changeCredit * -1
                        } 
                    )
                    message.success("Update successfully!")
                    setChangeCredit(1)
                    refreshTable()
                }}
                onCancel={() => (1)}
                okText="Send"
                cancelText="Cancel">
                <Button disabled={record.current_credit < 0} icon={<MinusIcon />} type="text"></Button>
            </Popconfirm>
            <Button onClick={() => {setShowTransactionModal(record.id)}} icon={<ViewCreditIcon />} type="text"/>
            </Flex>
        )},
    ]

    return (
        <>
        {holder}

        <StudentModal editLeadData={editStudentData} schoolList={schoolList}
        onCancel={() => {
            // setIsCreateStudent(false);
            setEditStudentData(null);
            refreshTable()
        }}/>
        
        <Space orientation="vertical" size="medium" style={{display : "flex"}} className="card">
            <Flex style={{alignItems:"center", justifyContent:"space-between"}}>
                <Flex style={{alignItems:"center"}} gap={"medium"}>
                    <Typography.Title>Student</Typography.Title>
                    <Tag 
                    color="gray" 
                    style={{fontWeight: "bold", padding: "0.5vw", borderRadius: "5vw"}}
                    >
                        {totalStudent} records
                    </Tag>
                </Flex>
                {/* <Button 
                color="geekblue"
                // onClick={() => setIsCreateStudent(true)} 
                type="primary"
                icon={<AddStudentIcon/>}
                size="large"
                >
                    Add Student
                </Button> */}
            </Flex>
        </Space>
        <Space className="card" orientation="vertical" size="medium" style={{display : "flex"}}>
            <Input.Search onSearch={onSearch} placeholder="Search student" />
            <ViewTable urls={`${URL_MEMBER.STUDENT}?${filter ?? ""}`} columns={studentColumns} refresh={refresh} getCount={setTotalStudent} search={true}/> 
        </Space>
        <TransactionModal studentId={showTransactionModal} closeTransactionModal={closeTransactionModal}/>
        </>

    )

}