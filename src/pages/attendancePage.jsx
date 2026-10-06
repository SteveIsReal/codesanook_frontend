import React, { Fragment } from 'react';
import { Button, Typography, Space, Form } from "antd";
import CreateSessionForm from "../components/createSessionForm";
import SessionHistoryModal from '../components/sessionHistoryModal';
import axios from "axios"
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

export const SESSION_TAB = {
  CURRENT: '#current',
  HISTORY: '#history'
}

export default function AttendancePage() {
  const navigate = useNavigate();
  const { courseId, sessionId } = useParams();
  const [sessionForm] = Form.useForm()

  useEffect(() => {
      const token = localStorage.getItem('userToken')
      if (token){
        axios.defaults.headers.common = { 'Authorization' : `Bearer ${token}`}
      }
      else {
        navigate(PATH.LOGIN, replace)
      }
    }, [])  

  return (
      <Space style={{padding:"1rem", width:"95vw"}} orientation={'vertical'} >
      <Typography><h1>{sessionId === "create" ? "Create" : "Edit"} attendance</h1></Typography>
      <CreateSessionForm courseId={courseId} sessionId={sessionId} sessionForm={sessionForm}/>
      </Space>
  )
}

