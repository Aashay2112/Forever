import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {

  const logout = () => {
    localStorage.removeItem("token") // remove saved token
    setToken("")                     // reset state in App
  }

  return (
    <div className="flex items-center py-2 px-[4%] justify-between border-b border-gray-300 bg-white shadow-sm">

      {/* Logo */}
      <img
        className="w-[max(10%,80px)] cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      {/* Logout Button */}
      <button
        onClick={logout}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full transition-colors"
      >
        Logout
      </button>

    </div>
  )
}

export default Navbar