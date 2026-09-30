import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router'
import MenuPage from './pages/menuPage'
import LoginPage from './pages/loginPage'
import Student from './components/student'
import Teacher from './components/teacher'
import Room from './components/room'
import Course from './components/course'
import Curriculum from './components/curriculum';

function App() {

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Add private route */}
      <Route path="/" element={<MenuPage />} >
        <Route path='/student' element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/room" element={<Room />} />
        <Route path="/course" element={<Course />} />
        <Route path="/curriculum" element={<Curriculum />} />
      </Route>
      <Route path="*" element={<p>Error kub 404</p>}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
