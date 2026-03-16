import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const Navigate = useNavigate();

  const { getCartAmount, currency, delivery_fee, cartItems, products, backendUrl, token, setCartItems } = useContext(ShopContext)

  const [method, setMethod] = useState('cod')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData(data => ({...data, [name]: value}))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('Form submitted')

    // Validate required fields
    const { firstName, lastName, email, street, city, state, zipcode, country, phone } = formData;
    if (!firstName || !lastName || !email || !street || !city || !state || !zipcode || !country || !phone) {
      toast.error('please fill all the required data');
      return;
    }

    try {
      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = products.find(product => product._id === items)
            if (itemInfo) {
              orderItems.push({
                productId: items,
                name: itemInfo.name,
                price: itemInfo.price,
                quantity: cartItems[items][item],
                size: item,
                image: itemInfo.image[0]
              })
            }
          }
        }
      }

      console.log('Order items:', orderItems)

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method
      }

      console.log('Order data:', orderData)

      const response = await axios.post(backendUrl + '/api/order/place', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log('API response:', response.data)

      if (!response.data.success) {
        toast.error(response.data.message)
        return
      }

      // COD flow
      if (method === 'cod') {
        if (setCartItems) setCartItems({})
        Navigate('/orders')
        return
      }

      // Stripe flow: redirect to Stripe Checkout
      if (method === 'stripe' && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl
        return
      }

      // If we reach here, something unexpected happened
      toast.error('Unable to initiate payment. Please try again.')


    } catch (error) {
      console.log('Error:', error)
      toast.error('Order placement failed')
    }
  }

  return (

    <form onSubmit={onSubmitHandler} className='border-t pt-14 min-h-[80vh] flex flex-col lg:flex-row justify-between gap-10'>

      {/* LEFT SIDE — DELIVERY INFO */}

      <div className='flex flex-col gap-4 w-full lg:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border rounded py-2 px-3 w-full' placeholder='First Name'/>
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border rounded py-2 px-3 w-full' placeholder='Last Name'/>
        </div>

        <input onChange={onChangeHandler} name='email' value={formData.email} className='border rounded py-2 px-3 w-full' placeholder='Email Address'/>

        <input onChange={onChangeHandler} name='street' value={formData.street} className='border rounded py-2 px-3 w-full' placeholder='Street'/>

        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={formData.city} className='border rounded py-2 px-3 w-full' placeholder='City'/>
          <input onChange={onChangeHandler} name='state' value={formData.state} className='border rounded py-2 px-3 w-full' placeholder='State'/>
        </div>

        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border rounded py-2 px-3 w-full' placeholder='Zip Code'/>
          <input onChange={onChangeHandler} name='country' value={formData.country} className='border rounded py-2 px-3 w-full' placeholder='Country'/>
        </div>

        <input onChange={onChangeHandler} name='phone' value={formData.phone} className='border rounded py-2 px-3 w-full' placeholder='Phone'/>

      </div>


      {/* RIGHT SIDE — CART TOTAL + PAYMENT */}

      <div className='w-full lg:max-w-[450px]'>

        <div className='text-xl sm:text-2xl mb-4'>
          <Title text1={'CART'} text2={'TOTALS'} />
        </div>

        <div className='border rounded p-5 flex flex-col gap-3'>

          <div className='flex justify-between'>
            <p>Subtotal</p>
            <p>{currency}{getCartAmount()}</p>
          </div>

          <hr/>

          <div className='flex justify-between'>
            <p>Delivery Fee</p>
            <p>{currency}{delivery_fee}</p>
          </div>

          <hr/>

          <div className='flex justify-between font-semibold text-lg'>
            <p>Total</p>
            <p>{currency}{getCartAmount() + delivery_fee}</p>
          </div>

        </div>


        {/* PAYMENT METHOD */}

        <div className='mt-8'>

          <Title text1={'PAYMENT'} text2={'METHOD'} />

          <div className='flex flex-col gap-3 mt-4'>

            <div
              onClick={()=>setMethod('stripe')}
              className={`flex items-center gap-3 border p-3 cursor-pointer ${method==='stripe' ? 'border-black' : ''}`}
            >
              <div className={`w-4 h-4 border rounded-full ${method==='stripe' ? 'bg-black' : ''}`}></div>
              <img className='h-5' src={assets.stripe_logo}/>
            </div>


            <div
              onClick={()=>setMethod('cod')}
              className={`flex items-center gap-3 border p-3 cursor-pointer ${method==='cod' ? 'border-black' : ''}`}
            >
              <div className={`w-4 h-4 border rounded-full ${method==='cod' ? 'bg-black' : ''}`}></div>
              <p className='text-gray-600 text-sm font-medium'>CASH ON DELIVERY</p>
            </div>

          </div>

        </div>


        {/* PLACE ORDER BUTTON */}

        <button type='submit' className='w-full bg-black text-white py-3 mt-6 hover:bg-gray-800'>
          PLACE ORDER
        </button>

      </div>

    </form>
  )
}

export default PlaceOrder