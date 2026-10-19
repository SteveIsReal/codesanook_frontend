import React from 'react'
import CustomRoute from './routes/CustomRoute';
import {ConfigProvider} from 'antd'
import "./app.css"

function App() {

  return ( 
    <ConfigProvider
    theme={{
      token : {
        fontFamily: "Nunito, sans-serif",
      }
    }}
    >
      <CustomRoute/>
    </ConfigProvider>
  )
}

export default App
