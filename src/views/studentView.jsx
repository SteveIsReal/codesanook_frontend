import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Space, Table, Button, Flex, Popconfirm, InputNumber, message, Input } from "antd";
import { EditOutlined, EyeFilled, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import StudentModal from "../components/studentModal";
import TransactionModal from "../components/transactionModal";
import { URL_MEMBER } from "../constants/urls";
import ViewTable from "../components/viewTable";

export default function StudentView(){

    const [isCreateStudent, setIsCreateStudent] = useState(false)
    const [editStudentData, setEditStudentData] = useState(null)
    const [schoolList, setSchoolList] = useState([])
    const [changeCredit, setChangeCredit] = useState(0)
    const [totalStudent, setTotalStudent] = useState(0)
    const [refresh, setRefresh] = useState(0)
    const [showTransactionModal, setShowTransactionModal] = useState(null)
    const [messageApi, holder] = message.useMessage()
    const [filter, setFilter] = useState(null)
    

    const refreshTable = async () => {
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
        {title : 'Name', dataIndex: "name", key:'name'},
        {title : 'Course', dataIndex: "course", key:'course', render : (data) => (
        <ul>{data.map(d => (<li>{d}</li>))}</ul>
        )},
        {title : 'Credit', dataIndex: "current_credit", key:'current_credit'},
        {title : 'Action', key:'email', render : (_, record) => (
            <Flex gap={"medium"}>
            <Button onClick={() => (setEditStudentData(record))} icon={<EditOutlined />} color="yellow" variant=""/>
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
                    refreshTable()
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
                    refreshTable()
                }}
                onCancel={() => (1)}
                okText="Send"
                cancelText="Cancel">
                <Button color="danger" variant="solid" icon={<MinusOutlined />} onClick={() => 1}></Button>
            </Popconfirm>
            <Button onClick={() => {setShowTransactionModal(record.id)}} icon={<EyeFilled />}/>

            {/* <Button color="danger" variant="solid" onClick={() => 1}>-</Button> */}
            </Flex>
        )},
    ]

    return (
        <>
        {holder}
        <h1>Student</h1>
        <h3>Total : {totalStudent}</h3>

        <StudentModal isCreateStudent={isCreateStudent} editStudentData={editStudentData} schoolList={schoolList} 
        onCancel={() => {
            setIsCreateStudent(false);
            setEditStudentData(null);
            refreshTable()
            }}/>
        
        <Space orientation="vertical" size="medium" style={{display : "flex"}}>
            <Button onClick={() => setIsCreateStudent(true)} type="primary">Add Student</Button>
            <Input.Search onSearch={onSearch} placeholder="Search student"/>
            <ViewTable urls={`${URL_MEMBER.STUDENT}?${filter ?? ""}`} columns={studentColumns} refresh={refresh} getCount={setTotalStudent} search={true}/> 
        </Space>
        <TransactionModal studentId={showTransactionModal} closeTransactionModal={closeTransactionModal}/>
        </>

    )

}