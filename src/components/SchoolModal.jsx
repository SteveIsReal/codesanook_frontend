import { Form, Input, Modal, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import "../styles/modal.css"
import { Add, EditSquare } from "@mui/icons-material";
import axios from "axios";
import { URL_MEMBER } from "../constants/urls";

export default function SchoolModal({editSchoolData, isCreateSchool, onCancel}) {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.setFieldsValue(editSchoolData)
  }, [editSchoolData, isCreateSchool])

  const submit = async () => {
    try{
      setLoading(true)
      form.validateFields()
      const formData = form.getFieldsValue()
      const response = isCreateSchool ? 
        await axios.post(URL_MEMBER.SCHOOL, formData) : 
        await axios.patch(`${URL_MEMBER.SCHOOL}${editSchoolData.id}/`, formData)
      onCancel(true)
    } catch (err) {
      console.error(err)
    } finally {
      form.resetFields()
      setLoading(false)
    }
  }

  return (
    <Modal 
    open={editSchoolData != null || isCreateSchool} 
    onCancel={() => onCancel(false)}
    onOk={submit}
    destroyOnHidden 
    className="modal"
    loading={loading}
    title={(
    <Space>
        <Space className={"icon"}>
            {isCreateSchool ? <Add /> : <EditSquare />}
        </Space>
        <Typography className={"modal-header"}>
            {isCreateSchool ? "Add New" : "Edit"} School
        </Typography>
    </Space>
    )}
    >
      <Form form={form}>
        <Form.Item name={"name"} key={"name"} label="name" rules={[{required: true}]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}