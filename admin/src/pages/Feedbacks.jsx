import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backend_url } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Feedbacks = ({ token }) => {
  const [feedbacks, setFeedbacks] = useState([])

  const fetchAllFeedbacks = async () => {
    if (!token) return

    try {
      const response = await axios.get(backend_url + '/api/feedback/list', {
        headers: { token }
      })

      if (response.data.success) {
        setFeedbacks(response.data.feedbacks)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllFeedbacks()
  }, [token])

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
      
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 pb-2 border-b-2 border-gray-300 inline-block">
          Feedbacks
        </h3>
        
        <div className="grid gap-6">
          {feedbacks.map((feedback, index) => (
            <div 
              key={index}
              className='group relative bg-white rounded-xl overflow-hidden border border-gray-300 shadow-md hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1'
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-gray-300 to-gray-400 group-hover:from-blue-500 group-hover:to-indigo-400 transition-colors duration-300"></div>
              
              <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 p-6 sm:p-8 items-center'>
                
                {/* User Icon */}
                <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-full bg-gray-100 items-center justify-center border border-gray-300 group-hover:scale-110 group-hover:bg-gray-200 transition-transform duration-300">
                  <img className='w-8' src={assets.order_icon} alt="Feedback" />
                </div>

                {/* Main Content Grid */}
                <div className='flex flex-col sm:flex-row gap-6 w-full justify-between items-start sm:items-center'>
                  
                  {/* Sender Details */}
                  <div className="space-y-4 w-full sm:w-2/3">
                    <div>
                      <p className='font-bold text-gray-800 flex items-center gap-2 text-lg'>
                         {feedback.name}
                      </p>
                      <div className="text-sm text-gray-600 mt-1">
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          <a href={`mailto:${feedback.email}`} className="text-blue-600 hover:underline">{feedback.email}</a>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                      <p className="text-sm font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">Message</p>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap">
                        {feedback.message}
                      </div>
                    </div>
                  </div>

                  {/* Feedback Mini-table display */}
                  <div className="flex flex-col justify-center space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-300 w-full sm:w-1/3 mt-4 sm:mt-0">
                    <div className="flex justify-between items-center text-sm border-b border-gray-300 pb-2">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-700">{new Date(feedback.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-700">{new Date(feedback.date).toLocaleTimeString()}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}

          {feedbacks.length === 0 && (
             <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-300 shadow-sm">
                No feedbacks available.
             </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Feedbacks
