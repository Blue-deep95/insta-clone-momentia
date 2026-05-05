import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"

export default function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login"  element={<Login/>}/>
      <Route path="/forgot-password"  element={<ForgotPassword/>}/> 
      </Routes>
      </BrowserRouter>
    </div>
  )
}