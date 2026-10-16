import { Modal, Space, Input, Flex, Popconfirm, Typography, Button } from "antd";
import ViewTable from "./viewTable";
import { URL_MEMBER } from "../constants/urls";
import "../styles/modal.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { ApprovalOutlined, Check, DeleteOutlineOutlined } from "@mui/icons-material";

export default function ToApproveLeadModal({ openToApproveLeadModal, closeModal }) {

  const [refresh, setRefresh] = useState(0)
  const [totalPendingApproval, setTotalPendingApproval] = useState(0)
  const [filter, setFilter] = useState(null)

  const refreshTable = () => {
    setRefresh(refresh + 1)
  }

  const onSearch = async (value, _e, info) => {
    setFilter(`search=${value}`)
    refreshTable()
  }

  const onConfirm = async (record) => {
    const response = await axios.patch(`${URL_MEMBER.LEAD}${record.id}/`, {approve: true})
    refreshTable()
  }

  const onDelete = async (record) => {
    const response = await axios.delete(`${URL_MEMBER.LEAD}${record.id}/`)
    refreshTable()
  }

  const LeadColumns = [
    {title : 'Name', dataIndex: "name", key:'name', render: (data) => (
        <Flex gap="medium" style={{alignItems: "center"}} wrap>
          <Typography style={{fontWeight: "bold"}}>{data}</Typography>
        </Flex>
    )},
    {title : 'Action', width:'10%' ,render : (_, record) => (
        <Flex gap={"medium"}>
        <Button onClick={() => onConfirm(record)} icon={<Check />} color="green" variant="outlined"/>
        <Popconfirm 
        title="Remove" 
        description="This action can't be reverse." 
        placement="topRight"
        onConfirm={() => onDelete(record)}
        >
          <Button icon={<DeleteOutlineOutlined />} danger/>
        </Popconfirm>
        </Flex>
    )},
  ]

  return (
    <Modal 
    open={openToApproveLeadModal} 
    destroyOnHidden 
    onCancel={closeModal} 
    onOk={closeModal} 
    getContainer={false}
    mask={{blur: true}}
    width='50%'
    >
      <Space className="card" orientation="vertical" size="medium" style={{display : "flex"}}>
        <Input.Search onSearch={onSearch} placeholder="Search Lead" />
        <ViewTable 
        urls={`${URL_MEMBER.LEAD_UNAPPROVE}&${filter ?? ""}`}
        columns={LeadColumns} 
        refresh={refresh} 
        getCount={setTotalPendingApproval} 
        search={true}
        /> 
      </Space>
    </Modal>
  )
}