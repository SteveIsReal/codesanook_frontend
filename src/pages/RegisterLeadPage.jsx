import RegisterLeadForm from "../views/RegisterLeadView";
import { Space } from 'antd'
import { useParams } from "react-router";


export default function RegisterLeadPage() {
  const { leadId } = useParams()
  return (
    <Space style={{padding:"1rem", width:"95vw"}} orientation={'vertical'} >
      <RegisterLeadForm leadId={leadId}/>
    </Space>
  )
}