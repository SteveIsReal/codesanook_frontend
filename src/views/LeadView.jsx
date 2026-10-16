import React, { use, useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/EditOutlined"
import AddLeadIcon from "@mui/icons-material/PersonAddOutlined"

import { useNavigate, useSearchParams } from "react-router";
import { Space, Button, Flex, message, Input, Tag, Typography, Popconfirm } from "antd";
import axios from "axios";
import LeadModal from "../components/LeadModal";
import { URL_MEMBER } from "../constants/urls";
import ViewTable from "../components/ViewTable";

import "../styles/table.css"
import { Add, Approval, Check, Close, DeleteOutlineOutlined } from "@mui/icons-material";
import ToApproveLeadModal from "../components/ToApproveLeadModal";
import { PATH } from "../routes/CustomRoute";

export default function LeadView(){

    const [isCreateLead, setIsCreateLead] = useState(false)
    const [editLeadData, setEditLeadData] = useState(null)
    const [schoolList, setSchoolList] = useState([])
    const [totalLead, setTotalLead] = useState(0)
    const [refresh, setRefresh] = useState(0)
    const [messageApi, holder] = message.useMessage()
    const [filter, setFilter] = useState(null)
    const navigate = useNavigate()
    const [openToApproveLead, setOpenToApproveLead] = useState(false)
    

    const refreshTable = () => {
        setRefresh(refresh + 1)
    }

    const onSearch = async (value, _e, info) => {
        setFilter(`search=${value}`)
        refreshTable()
    }

    const onConfirm = async (record) => {
      const response = await axios.post(URL_MEMBER.STUDENT, {lead:record.id})
      refreshTable()
    }

    const onDelete = async (record) => {
      const response = await axios.delete(`${URL_MEMBER.LEAD}${record.id}/`)
      refreshTable()
    }

    const fetchSchoolList = async () => {
        // add try catch
        const response = await axios.get(URL_MEMBER.GET_SCHOOL)
        setSchoolList(response.data.map(d => ({value: d.id, label: d.name})))
    }

    useEffect(() => {
        fetchSchoolList()
    }, [])

    const LeadColumns = [
        {title : 'Name', dataIndex: "name", key:'name', render: (data) => (
            <Flex gap="medium" style={{alignItems: "center"}} wrap>
              <Typography style={{fontWeight: "bold"}}>{data}</Typography>
            </Flex>
        )},
        {title : "Student", dataIndex: "registered",width:"1%", render: (data) => (
          data ? (<Check/>) : (<Close/>)
        )},
        {title : 'Action', width:'10%' ,render : (_, record) => (
            <Flex gap={"medium"}>
            {/* <Button onClick={() => (setEditLeadData(record))} icon={<EditIcon />} type="text"/> */}
            <Button onClick={() => (navigate(`/${PATH.REGISTER_LEAD}/${record.id}`))} icon={<EditIcon />} type="text"/>
            <Popconfirm 
            title="Add to student" 
            description="This action can't be reverse." 
            placement="topLeft"
            onConfirm={() => onConfirm(record)}
            >
              <Button disabled={record.registered} icon={<Add />}/>
            </Popconfirm>
            <Popconfirm 
            title="Delete this lead" 
            description="This action can't be reverse." 
            placement="topLeft"
            onConfirm={() => onDelete(record)}
            >
              <Button icon={<DeleteOutlineOutlined />} danger/>
            </Popconfirm>
            </Flex>
        )},
    ]

    return (
        <>
        {holder}

        <LeadModal isCreateLead={isCreateLead} editLeadData={editLeadData} schoolList={schoolList} 
        onCancel={(update = false) => {
          setIsCreateLead(false);
          setEditLeadData(null);
          update && refreshTable()
        }}/>
        <ToApproveLeadModal openToApproveLeadModal={openToApproveLead} 
        closeModal={() => {
          setOpenToApproveLead(false)
          refreshTable()
        }}/>
        
        <Space orientation="vertical" size="medium" style={{display : "flex"}} className="card">
            <Flex style={{alignItems:"center", justifyContent:"space-between"}}>
                <Flex style={{alignItems:"center"}} gap={"medium"}>
                    <Typography.Title>Lead</Typography.Title>
                    <Tag 
                    color="gray" 
                    style={{fontWeight: "bold", padding: "0.5vw", borderRadius: "5vw"}}
                    >
                        {totalLead} records
                    </Tag>
                </Flex>
                <Flex gap={"small"}>
                  <Button 
                  onClick={() =>setOpenToApproveLead(true)}
                  icon={<Approval/>}
                  size="large"
                  >
                    Pending Lead
                  </Button>
                  <Button 
                  color="geekblue"
                  onClick={() => navigate(`/${PATH.REGISTER_LEAD}`)} 
                  type="primary"
                  icon={<AddLeadIcon/>}
                  size="large"
                  >
                    Add Lead
                  </Button>
                </Flex>
            </Flex>
        </Space>
        <Space className="card" orientation="vertical" size="medium" style={{display : "flex"}}>
            <Input.Search onSearch={onSearch} placeholder="Search Lead" />
            <ViewTable 
            urls={`${URL_MEMBER.LEAD_APPROVED}&${filter ?? ""}`}
            columns={LeadColumns} 
            refresh={refresh} 
            getCount={setTotalLead} 
            search={true}
            /> 
        </Space>
        </>

    )

}