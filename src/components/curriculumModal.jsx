import { useState, useEffect } from 'react'
import { Form, Input, Modal, Button, Space, Card, message, Upload } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import { URL_CLASSROOM } from '../constants/urls';

export default function CurriculumModal(props){

    const [form] = Form.useForm()
    const [requestForm, setRequestForm] = useState({})
    const [messageInfo, contentHolder] = message.useMessage()

    const setFields = () => {
        return props.isCreateCurriculum ? form.resetFields() : form.setFieldsValue(props.editCurriculumData)
    }

    const Submit = async () => {
        try {
            const validate = await form.validateFields()
            const formData = form.getFieldsValue()
            // setRequestForm(formData)
            // console.log(requestForm)
            // setRequestForm({...requestForm, subjects:requestForm.subjects.map((d) => (d.id === undefined ? {...d, ids: d.id} : {...d}))})
            console.log(formData)
            // console.log(requestForm)

            if (props.isCreateCurriculum) {
                const response = await axios.post(URL_CLASSROOM.CURRICULUM, formData)
            } 
            else {
                const response = await axios.put(`${URL_CLASSROOM.CURRICULUM}${props.editCurriculumData.id}/`, formData)
            }

            props.cancel()
        }
        catch(err) {
            messageInfo.open({
                type: "error",
                content: err.message
            })
        }

    }

    useEffect(() => {
        setFields()
    }, [props.editCurriculumData, props.isCreateCurriculum])

    return (
    <Modal open={props.editCurriculumData || props.isCreateCurriculum} onCancel={props.cancel} onOk={Submit}>
        {contentHolder}
        <h2>{props.isCreateCurriculum ? "Create" : "Edit"} Curriculum</h2>
        <Form form={form}>
            <Form.Item label="Name" name="name" rules={[{required:true, message:"Please add name"}]}>
                <Input />
            </Form.Item>
            <Form.List name="subjects">
                {(fields, {add, remove}) => (
                    <>
                    {fields.map(({key, name, ...restField}) => (
                            <Card key={key} >
                            <Form.Item {...restField} name={[name, "id"]} hidden>
                                <Input />
                            </Form.Item>
                            <Form.Item {...restField} label="Topic" name={[name, "topic"]} rules={[{required:true, message:"Please add topic"}]}>
                                <Input />
                            </Form.Item>
                            <Form.Item {...restField} label="Objective" name={[name, "objective"]} rules={[{required:true, message:"Please add objective"}]}>
                                <Input.TextArea />
                            </Form.Item>
                            {/* Future feature : <Form.Item {...restField} name={[name, "file"]}>
                                <Upload.Dragger>
                                    Drag the file here
                                </Upload.Dragger>
                            </Form.Item> */} 
                            <Button onClick={() => {remove(name)}} block icon={<CloseOutlined/>} danger type="dashed">
                                Remove
                            </Button>
                            </Card>

                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Subject
                        </Button>
                    </Form.Item>
                    </>
                )}
            </Form.List>
        </Form>
    </Modal>
    )
}