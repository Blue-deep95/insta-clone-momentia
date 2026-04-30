import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"

export default function App() {
  return (
    <div>
      <BrowserRouter>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/Login"  element={<Login/>}/>
      </BrowserRouter>
    </div>
  )
}
