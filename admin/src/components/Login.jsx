import axios from 'axios'
import React, { useState } from 'react'
import { backend_url } from '../App'
import { toast, ToastContainer } from 'react-toastify'

const Login = ({ setToken }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {

      const response = await axios.post(
        backend_url + "/api/user/login",
        { email, password }
      )

      if (response.data.success && response.data.role === 'admin') {
        setToken(response.data.token)
        localStorage.setItem("token", response.data.token)
      } else {
        toast.error("Invalid Admin Credentials")
      }

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">

        <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Admin Panel
        </h1>

        <form onSubmit={onSubmitHandler}>

          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>

            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password
            </p>

            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition"
            type="submit"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login