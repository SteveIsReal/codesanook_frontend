
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router'
import MenuPage from '../pages/menuPage'
import LoginPage from '../pages/loginPage'
import StudentView from '../views/studentView';
import TeacherView from '../views/teacherView';
import RoomView from '../views/roomView';
import CourseView from '../views/courseView';
import CurriculumView from '../views/curriculumView';
import AttendanceView from '../views/attendanceView';
import AttendancePage from '../pages/attendancePage';

export const PATH = {
  MAIN: '/',
  LOGIN: 'login',

  STUDENT: 'student',
  TEACHER: 'teacher',
  CLASSROOM: 'classroom',
  COURSE: 'course',
  CURRICULUM: 'curriculum',
  ATTENDANCE: 'attendance'

};


export default function CustomRoute() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path={`/${PATH.LOGIN}`} element={<LoginPage />} />
      {/* Add private route */}
      <Route path="/" element={<MenuPage />} >
        <Route path={PATH.STUDENT} element={<StudentView />} />
        <Route path={PATH.TEACHER} element={<TeacherView />} />
        <Route path={PATH.CLASSROOM} element={<RoomView />} />
        <Route path={PATH.COURSE} element={<CourseView />} />
        <Route path={PATH.CURRICULUM} element={<CurriculumView />} />
        <Route path={PATH.ATTENDANCE} element={<AttendanceView />} />
      </Route>
      <Route path={`/${PATH.ATTENDANCE}/:courseId/:sessionId`} element={<AttendancePage />}/>
      <Route path="*" element={<p>Error kub 404</p>}></Route>
    </Routes>
  </BrowserRouter>
  )
}
