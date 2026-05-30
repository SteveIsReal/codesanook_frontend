import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router'
import MenuPage from './pages/menuPage'
import LoginPage from './pages/loginPage'
import Student from './components/student'
import Teacher from './components/teacher'

function App() {

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="menu" element={<MenuPage />} >
        <Route path='student' element={<Student />} />
        <Route path="teacher" element={<Teacher />} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
