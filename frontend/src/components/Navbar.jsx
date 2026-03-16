import React, { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

  const [visible, setVisible] = useState(false)

  const { setShowSearch, getCartCount, isLoggedIn, logout } = useContext(ShopContext)
  const navigate = useNavigate()

  const location = useLocation()

  return (
    <div className='flex text-slate-950 items-center justify-between py-5 font-medium relative'>

      <Link to='/'>
        <img src={assets.logo} className='w-36' alt="logo" />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/collection'>Collection</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/contact'>Contact</NavLink>
      </ul>

      <div className='flex items-center gap-5'>

        {location.pathname.includes('/collection') && (
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className='w-5 cursor-pointer'
          />
        )}

        <div className='relative group'>
          <button
            onClick={() => {
              if (isLoggedIn) {
                navigate('/orders');
              } else {
                navigate('/login');
              }
            }}
            className='flex items-center'
          >
            <img className='w-5 cursor-pointer' src={assets.profile_icon} />
          </button>

          <div className='group-hover:block hidden absolute pt-4 right-0'>
            <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate('/orders')}
                    className='text-left'
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className='text-left'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className='text-left'
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5' />

          {isLoggedIn && getCartCount() > 0 && (
            <p className='absolute right-[-5px] bottom-[-4px] w-4 text-center leading-4 bg-black text-white rounded-full text-[8px]'>
              {getCartCount()}
            </p>
          )}

        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 sm:hidden'
        />

      </div>

      <div
        className={`fixed top-0 right-0 h-full bg-white transition-all duration-300
        ${visible ? 'w-full' : 'w-0 overflow-hidden'}`}
      >
        <div className='flex flex-col text-gray-600'>

          <div
            onClick={() => setVisible(false)}
            className='flex items-center gap-4 p-3 cursor-pointer'
          >
            <img className='h-4 rotate-180' src={assets.dropdown_icon} />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} to='/contact'>CONTACT</NavLink>

        </div>
      </div>

    </div>
  )
}

export default Navbar