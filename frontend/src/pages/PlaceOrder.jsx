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

  // Helper: load Razorpay checkout script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.id = 'razorpay-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    // Validate required fields
    const { firstName, lastName, email, street, city, state, zipcode, country, phone } = formData;
    if (!firstName || !lastName || !email || !street || !city || !state || !zipcode || !country || !phone) {
      toast.error('Please fill all the required fields')
      return
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

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method
      }

      const response = await axios.post(backendUrl + '/api/order/place', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.data.success) {
        toast.error(response.data.message)
        return
      }

      // ── COD ──────────────────────────────────────────────────────────────────
      if (method === 'cod') {
        if (setCartItems) setCartItems({})
        Navigate('/orders')
        return
      }

      // ── Stripe ────────────────────────────────────────────────────────────────
      if (method === 'stripe' && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl
        return
      }

      // ── Razorpay ──────────────────────────────────────────────────────────────
      if (method === 'razorpay' && response.data.razorpayOrderId) {
        const { razorpayOrderId, amount, currency: rpCurrency, orderId, keyId } = response.data

        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
          toast.error('Failed to load Razorpay. Please check your internet connection.')
          return
        }

        const options = {
          key: keyId,
          amount: amount,           // in paise
          currency: rpCurrency,
          name: 'Forever',
          description: 'Order Payment',
          image: assets.logo,
          order_id: razorpayOrderId,
          handler: async (paymentResponse) => {
            try {
              const verifyRes = await axios.post(
                backendUrl + '/api/order/verify-razorpay',
                {
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  orderId: orderId,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              )

              if (verifyRes.data.success) {
                if (setCartItems) setCartItems({})
                toast.success('Payment successful!')
                Navigate('/orders')
              } else {
                toast.error(verifyRes.data.message || 'Payment verification failed')
              }
            } catch (err) {
              toast.error('Payment verification error. Please contact support.')
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}`,
          },
          theme: {
            color: '#000000',
          },
          modal: {
            ondismiss: () => {
              toast.info('Payment cancelled. Your order has not been confirmed.')
            }
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', (response) => {
          toast.error(`Payment failed: ${response.error.description}`)
        })
        rzp.open()
        return
      }

      toast.error('Unable to initiate payment. Please try again.')

    } catch (error) {
      console.log('Error:', error)
      toast.error('Order placement failed. Please try again.')
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

            {/* Stripe */}
            <div
              onClick={() => setMethod('stripe')}
              className={`flex items-center gap-3 border p-3 cursor-pointer ${method === 'stripe' ? 'border-black' : ''}`}
            >
              <div className={`w-4 h-4 border rounded-full flex-shrink-0 ${method === 'stripe' ? 'bg-black' : ''}`}></div>
              <img className='h-5' src={assets.stripe_logo} alt='Stripe'/>
            </div>

            {/* Razorpay */}
            <div
              onClick={() => setMethod('razorpay')}
              className={`flex items-center gap-3 border p-3 cursor-pointer ${method === 'razorpay' ? 'border-black' : ''}`}
            >
              <div className={`w-4 h-4 border rounded-full flex-shrink-0 ${method === 'razorpay' ? 'bg-black' : ''}`}></div>
              <img className='h-5' src={assets.razorpay_logo} alt='Razorpay'/>
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setMethod('cod')}
              className={`flex items-center gap-3 border p-3 cursor-pointer ${method === 'cod' ? 'border-black' : ''}`}
            >
              <div className={`w-4 h-4 border rounded-full flex-shrink-0 ${method === 'cod' ? 'bg-black' : ''}`}></div>
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