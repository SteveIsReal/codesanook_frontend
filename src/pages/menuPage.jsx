import { Layout, Menu, theme, Image, Button, Typography } from 'antd'
import React, { useEffect } from 'react'
import logo from '../assets/logo.png'
import { Outlet, replace, useNavigate } from 'react-router';
import axios from 'axios';
import { PATH } from '../routes/customRoute';
import { LogoutOutlined } from '@ant-design/icons';
import useAuth from '../context/authContext';

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
  {key:"student" , label:"Student"},
  {key:"course" , label:"Course"},
  {key:"teacher" , label:"Teacher"},
  {key:"classroom" , label:"Classroom"},
  {key:"curriculum", label:"Curriculum"},
  {key:"attendance", label:"Attendance"}
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
            <Button icon={<LogoutOutlined/>} onClick={onLogout}>Log out</Button>
            <Typography>{}</Typography>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
              <Outlet />
            </div>

          </Content>
        </Layout>
      </Layout>
    </>
    )
}