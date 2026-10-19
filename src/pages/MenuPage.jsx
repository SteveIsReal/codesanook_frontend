import { Layout, Menu, theme, Image, Button, Typography } from 'antd'

import StudentIcon from '@mui/icons-material/School'
import AssignmentIcon from "@mui/icons-material/Assignment"
import TeacherIcon from "@mui/icons-material/Person"
import RoomIcon from "@mui/icons-material/MeetingRoom"
import CurriculumIcon from "@mui/icons-material/Book"
import LogoutIcon from "@mui/icons-material/Logout"
import AttendanceIcon from "@mui/icons-material/FactCheck"

import React, { useEffect } from 'react'
import logo from '../assets/logo.png'
import { Outlet, replace, useNavigate } from 'react-router';
import axios from 'axios';
import { PATH } from '../routes/CustomRoute';
import useAuth from '../context/authContext';
import { CorporateFareOutlined, School, Verified, VerifiedOutlined } from '@mui/icons-material';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  background: 'white',
};

const items = [
  {key:"lead", label:"Leads", icon:(<VerifiedOutlined />)},
  {key:"student" , label:"Students", icon:(<StudentIcon />)},
  {key:"course" , label:"Courses", icon:(<AssignmentIcon/>)},
  {key:"teacher" , label:"Teachers", icon:(<TeacherIcon />)},
  {key:"classroom" , label:"Classrooms", icon:(<RoomIcon />)},
  {key:"curriculum", label:"Curriculums", icon:(<CurriculumIcon />)},
  {key:"attendance", label:"Attendances", icon:(<AttendanceIcon />)},
  {key:"school", label:"Schools", icon:(<CorporateFareOutlined/>)},
]

export default function MenuPage() {

    const navigate = useNavigate();
    const { logout, user } = useAuth()
    const isAdmin = user?.groups?.includes("admin")

    const onLogout = () => {
      logout()
      navigate(`/${PATH.LOGIN}`)
    }

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const onClick = e => {
      navigate(`${e.key}`)
    }

    useEffect(() => {
      const token = localStorage.getItem('userToken')
      if (token){
        axios.defaults.headers.common = { 'Authorization' : `Bearer ${token}`}
      }
      else {
        navigate(`/${PATH.LOGIN}`, replace)
      }
    }, [])  

    return (
    <>
      <Layout hasSider={isAdmin}>
        { isAdmin &&
        <Sider style={siderStyle}>
          <Image src={logo} preview={false} style={{height:"20vh", minHeight:"150px"}}></Image>
          <Menu onClick={onClick} mode="inline" items={items}></Menu>
        </Sider>
        }
        <Layout>
          <Header style={{ padding: 0, paddingRight: "1vw", background: colorBgContainer, display: 'flex', alignItems: 'center', flexDirection: 'row-reverse'}}>
            <Button icon={<LogoutIcon />} onClick={onLogout}>Logout</Button>
            <Typography>{}</Typography>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            {/* <div style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}> */}
              <Outlet />
            {/* </div> */}

          </Content>
        </Layout>
      </Layout>
    </>
    )
}