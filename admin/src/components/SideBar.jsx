import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const SideBar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 border-gray-300 bg-white shadow-sm'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        {/* Add Items */}
        <NavLink
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors'
          to="/add"
        >
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Add Items</p>
        </NavLink>

        {/* List Items */}
        <NavLink
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors'
          to="/list"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>List Items</p>
        </NavLink>

        {/* Orders */}
        <NavLink
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors'
          to="/orders"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Orders</p>
        </NavLink>

        {/* Feedbacks */}
        <NavLink
          className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors'
          to="/feedbacks"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Feedbacks</p>
        </NavLink>


      </div>
    </div>
  )
}

export default SideBar