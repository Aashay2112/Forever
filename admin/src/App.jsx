import React, { useState } from 'react'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Order from './pages/Order'
import Feedbacks from './pages/Feedbacks'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const backend_url = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [token, setToken] = useState(localStorage.getItem("token") || "")

  // If user not logged in, redirect to frontend login
  if (!token) {
    window.location.href = 'http://localhost:5173/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>

      <ToastContainer />

      <Navbar setToken={setToken} />

      <div className="flex w-full">

        <SideBar />

        <div className="flex-1 px-6 py-8 text-gray-800 text-base">

          <Routes>
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/orders" element={<Order token={token} />} />
            <Route path="/feedbacks" element={<Feedbacks token={token} />} />
          </Routes>

        </div>

      </div>

    </div>
  )
}

export default App