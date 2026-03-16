import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import Title from '../components/Title'
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  const { products, cartItems, currency, removeFromCart, updateQuantity, getCartAmount, delivery_fee } = useContext(ShopContext)

  const [cartData, setCartData] = useState([])

  useEffect(() => {

    const tempData = []

    for (const items in cartItems) {

      for (const item in cartItems[items]) {

        if (cartItems[items][item] > 0) {

          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })

        }

      }

    }

    setCartData(tempData)

  }, [cartItems])

  return (
    <div className='border-t pt-14'>

      {/* Title */}
      <div className='text-2xl mb-6'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {/* Cart Items */}
      <div>

        {cartData.map((item, index) => {

          const productData = products.find(
            (product) => product._id === item._id
          )

          return (

            <div
              key={index}
              className='py-6 border-t grid grid-cols-[4fr_1fr_1fr_0.5fr] items-center gap-4 text-gray-700'
            >

              {/* Product Info */}
              <div className='flex items-center gap-6'>

                <img
                  className='w-16 sm:w-20 rounded'
                  src={productData.image[0]}
                  alt=""
                />

                <div>

                  <p className='text-sm sm:text-lg font-medium'>
                    {productData.name}
                  </p>

                  <div className='flex items-center gap-4 mt-2 text-sm text-gray-500'>

                    <p>
                      {currency}{productData.price}
                    </p>

                    <p className='px-2 border bg-gray-50'>
                      {item.size}
                    </p>

                  </div>

                </div>

              </div>

              {/* Quantity */}
              <input
                className='border max-w-16 px-2 py-1'
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(
                    item._id,
                    item.size,
                    Number(e.target.value)
                  )
                }
              />

              {/* Total Price */}
              <p className='text-sm sm:text-base font-medium'>
                {currency}{productData.price * item.quantity}
              </p>

              {/* Delete Icon */}
              <img
                onClick={() => removeFromCart(item._id, item.size)}
                className="w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="delete"
              />

            </div>

          )

        })}

      </div>

      {/* Cart Summary */}
      <div className='flex justify-end my-12'>

        <div className='w-full sm:w-[450px]'>

          <div className='text-xl font-medium mb-4'>
            CART TOTAL
          </div>

          <div className='flex justify-between border-b py-2'>
            <p>Subtotal</p>
            <p>{currency}{getCartAmount()}</p>
          </div>

          <div className='flex justify-between border-b py-2'>
            <p>Delivery Fee</p>
            <p>{currency}{delivery_fee}</p>
          </div>

          <div className='flex justify-between py-3 font-semibold text-lg'>
            <p>Total</p>
            <p>{currency}{getCartAmount() + delivery_fee}</p>
          </div>

         <button
  onClick={() => navigate('/placeorder')}
  className='w-full bg-black text-white py-3 mt-4 hover:bg-gray-800'
>
  PROCEED TO CHECKOUT
</button>

        </div>

      </div>

    </div>
  )
}

export default Cart