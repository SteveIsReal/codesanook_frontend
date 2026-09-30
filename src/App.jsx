import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router'
import MenuPage from './pages/menuPage'
import LoginPage from './pages/loginPage'
import Student from './components/student'
import Teacher from './components/teacher'
import Room from './components/room'
import Course from './components/course'

export const PATH = {
  MAIN: '/',
  LOGIN: '/login',

  STUDENT: 'student'
};

function App() {

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MenuPage />} >
        <Route path='/student' element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/room" element={<Room />} />
        <Route path="/course" element={<Course />} />
      </Route>
      <Route path="*" element={<p>Error kub 404</p>}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
