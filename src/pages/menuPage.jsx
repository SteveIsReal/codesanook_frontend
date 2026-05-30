import { Layout, Menu, theme, Image } from 'antd'
import React from 'react'
import logo from '../assets/logo.png'
import { Outlet, useNavigate } from 'react-router';

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
  {key:"teacher" , label:"Teacher"}
]

export default function MenuPage() {

    const navigate = useNavigate();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const onClick = e => {
      navigate(`${e.key}`)
    }

    return (
    <>
      <Layout hasSider>
        <Sider style={siderStyle}>
          <Image src={logo} preview={false} style={{height:"10vh"}}></Image>
          <Menu onClick={onClick} mode="inline" items={items}></Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}/>
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