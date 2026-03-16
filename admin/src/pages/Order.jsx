import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backend_url } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Order = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return

    try {
      const response = await axios.get(backend_url + '/api/order/list', {
        headers: { token }
      })

      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backend_url + '/api/order/status', {
        orderId,
        status: event.target.value
      }, {
        headers: { token }
      })

      if (response.data.success) {
        await fetchAllOrders()
        toast.success('Status updated')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  // Helper to determine status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Placed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Packing': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Out for delivery': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
      
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 pb-2 border-b-2 border-gray-300 inline-block">
          Order Management
        </h3>
        
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div 
              key={index}
              className='group relative bg-white rounded-xl overflow-hidden border border-gray-300 shadow-md hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1'
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-gray-300 to-gray-400 group-hover:from-blue-500 group-hover:to-indigo-400 transition-colors duration-300"></div>
              
              <div className='grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 p-6 sm:p-8 items-center'>
                
                {/* Package Icon */}
                <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-full bg-gray-100 items-center justify-center border border-gray-300 group-hover:scale-110 group-hover:bg-gray-200 transition-transform duration-300">
                  <img className='w-8' src={assets.parcel_icon} alt="Package" />
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1fr] gap-6 w-full'>
                  
                  {/* Items & Address */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                      <p className="text-sm font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">Order Items</p>
                      <div className="text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <span key={index} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs text-gray-700">
                            {item.name} <span className="font-bold text-gray-800">x{item.quantity}</span> <span className="text-gray-500">({item.size})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className='font-bold text-gray-800 flex items-center gap-2'>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        {order.address.firstName + " " + order.address.lastName}
                      </p>
                      <div className="text-sm text-gray-600 mt-1 pl-6">
                        <p>{order.address.street + ","}</p>
                        <p>{order.address.city + ", " + order.address.state}</p>
                        <p>{order.address.country + " - " + order.address.zipcode}</p>
                        <p className="mt-1 font-medium text-gray-700 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          {order.address.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details Mini-table display */}
                  <div className="flex flex-col justify-center space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <div className="flex justify-between items-center text-sm border-b border-gray-300 pb-2">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-semibold text-gray-800">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-300 pb-2">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-semibold text-gray-800 uppercase text-xs px-2 py-0.5 bg-gray-200 rounded border border-gray-300">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-300 pb-2">
                      <span className="text-gray-600">Payment:</span>
                      <span className={`font-semibold text-xs px-2 py-0.5 rounded ${order.payment ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                        {order.payment ? 'Done' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-700">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center sm:justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className='text-2xl sm:text-3xl font-extrabold text-gray-800'>
                        <span className="text-blue-600">₹</span>{order.amount}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Status Dropdown */}
                <div className="w-full md:w-48 ml-auto border-t md:border-t-0 md:border-l border-gray-300 pt-4 md:pt-0 md:pl-6">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Update Status</p>
                  <select 
                    onChange={(event) => statusHandler(event, order._id)} 
                    value={order.status} 
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none font-semibold text-sm cursor-pointer shadow-sm ${getStatusColor(order.status)}`}
                    style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%239ca3af\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                  >
                    <option className="bg-white text-gray-800" value="Order Placed">Order Placed</option>
                    <option className="bg-white text-gray-800" value="Packing">Packing</option>
                    <option className="bg-white text-gray-800" value="Shipped">Shipped</option>
                    <option className="bg-white text-gray-800" value="Out for delivery">Out for delivery</option>
                    <option className="bg-white text-gray-800" value="Delivered">Delivered</option>
                  </select>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Order