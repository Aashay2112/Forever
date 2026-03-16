import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'

const About = () => {

  return (

    <div className='border-t'>

      {/* HERO TITLE */}

      <div className='text-3xl text-center pt-10'>
        <Title text1={'ABOUT'} text2={'FOREVER'} />
        <p className='text-gray-500 mt-3 max-w-2xl mx-auto text-sm'>
          Forever is more than just a fashion store. We are a community that
          believes in confidence, individuality, and timeless style. Our goal
          is to create a shopping experience that feels simple, inspiring, and
          enjoyable for everyone.
        </p>
      </div>



      {/* STORY SECTION */}

      <div className='my-16 flex flex-col md:flex-row items-center gap-12 px-6 md:px-20'>

        <img
          className='w-full md:max-w-[450px] rounded-lg shadow-md'
          src={assets.about_img}
          alt="Forever brand"
        />

        <div className='flex flex-col gap-6 text-gray-600 md:w-1/2'>

          <h2 className='text-2xl font-semibold text-gray-800'>
            Our Story
          </h2>

          <p>
            Forever was founded with a simple idea — fashion should be timeless,
            comfortable, and accessible to everyone. In a world where trends
            change quickly, we focus on delivering products that blend style,
            quality, and everyday usability.
          </p>

          <p>
            What started as a small idea has grown into a brand loved by
            customers who value simplicity and elegance. Our collections are
            carefully curated to bring you pieces that feel just as good as they
            look.
          </p>

          <p>
            From casual wear to statement outfits, Forever aims to inspire
            confidence and help you express your personality through fashion.
          </p>

        </div>

      </div>



      {/* WHY CHOOSE US */}

      <div className='text-xl text-center py-6'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20 mb-16'>

        <div className='border p-8 rounded-lg shadow-sm hover:shadow-md transition'>
          <h3 className='font-semibold text-lg mb-3'>
            Premium Quality
          </h3>
          <p className='text-gray-600 text-sm'>
            Every product goes through strict quality checks to ensure comfort,
            durability, and premium feel for our customers.
          </p>
        </div>

        <div className='border p-8 rounded-lg shadow-sm hover:shadow-md transition'>
          <h3 className='font-semibold text-lg mb-3'>
            Fast & Reliable Delivery
          </h3>
          <p className='text-gray-600 text-sm'>
            We partner with trusted logistics providers to ensure your orders
            reach you safely and on time.
          </p>
        </div>

        <div className='border p-8 rounded-lg shadow-sm hover:shadow-md transition'>
          <h3 className='font-semibold text-lg mb-3'>
            Customer First
          </h3>
          <p className='text-gray-600 text-sm'>
            Our customers are at the heart of everything we do. From easy
            returns to helpful support, we make sure your experience is smooth.
          </p>
        </div>

      </div>



      {/* BRAND VALUES */}

      <div className='bg-gray-50 py-16'>

        <div className='text-center mb-10'>
          <Title text1={'OUR'} text2={'VALUES'} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20 text-center'>

          <div>
            <h3 className='font-semibold text-lg mb-2'>Sustainability</h3>
            <p className='text-gray-600 text-sm'>
              We believe fashion should respect the planet. Our goal is to move
              toward more responsible materials and ethical sourcing.
            </p>
          </div>

          <div>
            <h3 className='font-semibold text-lg mb-2'>Innovation</h3>
            <p className='text-gray-600 text-sm'>
              We continuously improve our shopping experience by combining
              technology with thoughtful design.
            </p>
          </div>

          <div>
            <h3 className='font-semibold text-lg mb-2'>Community</h3>
            <p className='text-gray-600 text-sm'>
              Forever is built for people who love style, creativity, and
              individuality.
            </p>
          </div>

        </div>

      </div>



      {/* STATS */}

      <div className='py-16 px-6 md:px-20 grid grid-cols-2 md:grid-cols-4 text-center gap-8'>

        <div>
          <h2 className='text-3xl font-bold'>10K+</h2>
          <p className='text-gray-500 text-sm'>Happy Customers</p>
        </div>

        <div>
          <h2 className='text-3xl font-bold'>500+</h2>
          <p className='text-gray-500 text-sm'>Products</p>
        </div>

        <div>
          <h2 className='text-3xl font-bold'>4.8★</h2>
          <p className='text-gray-500 text-sm'>Customer Rating</p>
        </div>

        <div>
          <h2 className='text-3xl font-bold'>25+</h2>
          <p className='text-gray-500 text-sm'>Countries Served</p>
        </div>

      </div>

    </div>

  )
}

export default About