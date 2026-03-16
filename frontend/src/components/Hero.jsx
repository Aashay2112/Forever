import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-600'>

      {/* Left Content */}
      <div className='w-full sm:w-1/2 flex flex-col items-center justify-center py-10 sm:py-0 gap-3'>

        {/* Bestseller Line */}
        <div className='flex items-center gap-2'>
          <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
          <p className='font-medium text-sm md:text-base text-gray-600'>OUR BESTSELLERS</p>
        </div>

        {/* Heading */}
        <h1 className=' prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
          Latest Arrivals
        </h1>

        {/* Shop Now */}
        <div className='flex items-center gap-2 cursor-pointer'>
          <p className='font-semibold text-sm md:text-base text-gray-600'>SHOP NOW</p>
          <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
        </div>

      </div>

      {/* Right Image Section (optional) */}
      <img className='w-full sm:w-1/2' src={assets.hero_img} alt="" />
        {/* image later */}

    </div>
  )
}

export default Hero
