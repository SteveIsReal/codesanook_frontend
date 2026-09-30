import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Space, Table, Button, Flex, Popconfirm, InputNumber, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import StudentModal from "./studentModal";
import TransactionModal from "./transactionModal";
import { URL_MEMBER } from "../constants/urls";

export default function Student(){

    const [studentData, setStudentData] = useState([])
    const [isCreateStudent, setIsCreateStudent] = useState(false)
    const [editStudentData, setEditStudentData] = useState(null)
    const [schoolList, setSchoolList] = useState([])
    const [changeCredit, setChangeCredit] = useState(0)
    const [showTransactionModal, setShowTransactionModal] = useState(null)
    const [messageApi, holder] = message.useMessage()
    

    const fetchStudent = async () => {
        const response = await axios.get(URL_MEMBER.STUDENT)
        setStudentData(response.data)
    }

    const fetchSchoolList = async () => {
        const response = await axios.get(URL_MEMBER.GET_SCHOOL)
        setSchoolList(response.data.map(d => ({value: d.id, label: d.name})))
    }

    const closeTransactionModal = () =>{
        setShowTransactionModal(null)
    }

    useEffect(() => {
        fetchStudent()
        fetchSchoolList()
    }, [])

    const studentColumns = [
        {title : 'Name', dataIndex: "name", key:'name'},
        {title : 'Course', dataIndex: "course", key:'course', render : (data) => (
        <ul>{data.map(d => (<li>{d}</li>))}</ul>
        )},
        {title : 'Credit', dataIndex: "current_credit", key:'current_credit'},
        {title : 'Action', key:'email', render : (_, record) => (
            <Flex gap={"medium"}>
            <Button onClick={() => (setEditStudentData(record))}>Edit</Button>
            <Popconfirm 
                title="Add credit"
                description={<InputNumber min={1} defaultValue={1} onChange={value => (setChangeCredit(value))}/>}
                onConfirm={async () => {
                    const response = await axios.post(
                        URL_MEMBER.ADD_CREDIT, 
                        {
                            student : record.id,
                            credit : changeCredit
                        } 
                    )
                    message.success("Add credit successfully!")
                    fetchStudent()
                }}
                onCancel={() => (1)}
                okText="Send"
                cancelText="Cancel">
                <Button color="green" variant="solid" icon={<PlusOutlined />} ></Button>
            </Popconfirm>
            <Popconfirm 
                title="Use credit"
                description={<InputNumber min={1} defaultValue={1} onChange={value => (setChangeCredit(value))}/>}
                onConfirm={async () => {
                    const response = await axios.post(
                        URL_MEMBER.USE_CREDIT, 
                        {
                            student : record.id,
                            credit : changeCredit * -1
                        } 
                    )
                    message.success("Update successfully!")
                    fetchStudent()
                }}
                onCancel={() => (1)}
                okText="Send"
                cancelText="Cancel">
                <Button color="danger" variant="solid" icon={<PlusOutlined />} onClick={() => 1}></Button>
            </Popconfirm>
            <Button onClick={() => setShowTransactionModal(record.id)}>👁️</Button>
            {/* <Button color="danger" variant="solid" onClick={() => 1}>-</Button> */}
            </Flex>
        )},
    ]

    return (
        <>
        {holder}
        <h1>Student</h1>
        <h3>Total : {studentData.length}</h3>

        <StudentModal isCreateStudent={isCreateStudent} editStudentData={editStudentData} schoolList={schoolList} fetchStudent={fetchStudent} 
        onCancel={() => {
            setIsCreateStudent(false);
            setEditStudentData(null);
            }}/>
        
        <Space orientation="vertical" size="medium" style={{display : "flex"}}>
            <Button onClick={() => setIsCreateStudent(true)} type="primary">Add Student</Button>
            <Table dataSource={studentData} columns={studentColumns}></Table>
        </Space>
        < TransactionModal studentId={showTransactionModal} closeTransactionModal={closeTransactionModal}/>
        </>

    )

}