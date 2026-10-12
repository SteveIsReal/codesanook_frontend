
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router'
import RegisterLeadPage from '../pages/RegisterLeadPage';
import MenuPage from '../pages/MenuPage'
import LoginPage from '../pages/LoginPage'
import StudentView from '../views/StudentView';
import TeacherView from '../views/TeacherView';
import RoomView from '../views/RoomView';
import CourseView from '../views/CourseView';
import CurriculumView from '../views/CurriculumView';
import AttendanceView from '../views/AttendanceView';
import LeadView from '../views/LeadView'
import AttendancePage from '../pages/AttendancePage';
import ProtectedRoute from './ProtectRoute';
import SchoolView from '../views/SchoolView';

export const PATH = {
  MAIN: '/',
  LOGIN: 'login',
  REGISTER_LEAD: 'registerlead',

  LEAD: 'lead',
  STUDENT: 'student',
  TEACHER: 'teacher',
  CLASSROOM: 'classroom',
  COURSE: 'course',
  CURRICULUM: 'curriculum',
  ATTENDANCE: 'attendance',
  SCHOOL: 'school',

};


export default function CustomRoute() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path={`/${PATH.LOGIN}`} element={<LoginPage />} />
      <Route path={`/${PATH.REGISTER_LEAD}`} element={<RegisterLeadPage/>}/>
      <Route path="/" element={<MenuPage />}>
        <Route element={<ProtectedRoute allowedGroup={["admin"]}/>}>
          <Route path={PATH.STUDENT} element={<StudentView />} />
          <Route path={PATH.TEACHER} element={<TeacherView />} />
          <Route path={PATH.CLASSROOM} element={<RoomView />} />
          <Route path={PATH.COURSE} element={<CourseView />} />
          <Route path={PATH.CURRICULUM} element={<CurriculumView />} />
          <Route path={PATH.LEAD} element={<LeadView />}/>
          <Route path={PATH.SCHOOL} element={<SchoolView/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedGroup={["teacher", "admin"]}/>}>
          <Route path={PATH.ATTENDANCE} element={<AttendanceView />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedGroup={["teacher", "admin"]}/>}>
        <Route path={`/${PATH.ATTENDANCE}/:courseId/:sessionId`} element={<AttendancePage />}/>
      </Route>
      <Route path="*" element={<p>Error kub 404</p>}></Route>
    </Routes>
  </BrowserRouter>
  )
}
