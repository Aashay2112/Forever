import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'

const Orders = () => {

  const { products, currency, backendUrl, token } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) return

      const response = await axios.get(backendUrl + '/api/order/userorders', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (

    <div className='border-t pt-16'>

      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>

        {orderData.map((item,index) => (

          <div
            key={index}
            className='py-4 border-t border-b text-gray-700 flex flex-col gap-4'
          >

            {/* Product Info */}
            <div className='flex items-center justify-between'>

              <div className='flex items-center gap-6'>

                <img
                  className='w-16 sm:w-20'
                  src={item.image}
                  alt={item.name}
                />

                <div>

                  <p className='font-medium'>
                    {item.name}
                  </p>

                  <div className='flex items-center gap-4 mt-2 text-sm text-gray-500'>

                    <p>
                      {currency}{item.price}
                    </p>

                    <p className='px-2 border bg-gray-50'>
                      {item.size}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <p className='text-sm text-gray-400'>
                    Date: {new Date(item.date).toDateString()}
                  </p>

                  <p className='text-sm text-gray-400'>
                    Payment: {item.paymentMethod}
                  </p>

                </div>

              </div>

              {/* Status */}
              <div className='flex flex-col items-end gap-2'>

                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>

                <button onClick={loadOrderData} className='border px-4 py-2 text-sm hover:bg-black hover:text-white transition'>
                  Track Order
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}

export default Orders