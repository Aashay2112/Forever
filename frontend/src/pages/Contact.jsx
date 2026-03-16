import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'

const Contact = () => {

  return (

    <div className='border-t'>

      {/* Title */}
      <div className='text-2xl text-center pt-10'>
        <Title text1={'CONTACT'} text2={'US'} />
        <p className='text-gray-500 mt-3 text-sm max-w-2xl mx-auto'>
          We'd love to hear from you. Whether you have questions about your order,
          our products, or just want to say hello, our team is here to help.
        </p>
      </div>


      {/* Contact Info Section */}
      <div className='my-16 flex flex-col md:flex-row items-center gap-12 px-6 md:px-20'>

        <img
          className='w-full md:max-w-[420px] rounded-lg shadow-md'
          src={assets.contact_img}
          alt="Contact Forever"
        />

        <div className='flex flex-col gap-6 text-gray-600 md:w-1/2'>

          <h2 className='text-xl font-semibold text-gray-800'>
            Our Store
          </h2>

          <p>
            54709 Willms Station <br/>
            Suite 350, Washington, USA
          </p>

          <p>
            Tel: +1 (555) 123-4567 <br/>
            Email: support@forever.com
          </p>

          <p className='text-gray-500'>
            Our customer service team is available Monday – Friday
            from 9:00 AM to 6:00 PM to assist you.
          </p>

        </div>

      </div>


      {/* Contact Form */}

      <div className='bg-gray-50 py-16 px-6 md:px-20'>

        <div className='text-center mb-10'>
          <Title text1={'GET'} text2={'IN TOUCH'} />
        </div>

        <form className='max-w-xl mx-auto flex flex-col gap-4'>

          <input
            className='border px-4 py-2'
            type="text"
            placeholder='Your Name'
            required
          />

          <input
            className='border px-4 py-2'
            type="email"
            placeholder='Your Email'
            required
          />

          <textarea
            className='border px-4 py-2'
            rows="5"
            placeholder='Your Message'
            required
          ></textarea>

          <button
            className='bg-black text-white py-3 hover:bg-gray-800 transition'
            type='submit'
          >
            SEND MESSAGE
          </button>

        </form>

      </div>


      {/* Extra Support Section */}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20 py-16 text-center'>

        <div className='border p-8 rounded-lg shadow-sm'>
          <h3 className='font-semibold mb-2'>Customer Support</h3>
          <p className='text-gray-500 text-sm'>
            Need help with your order or product? Our support team is here for you.
          </p>
        </div>

        <div className='border p-8 rounded-lg shadow-sm'>
          <h3 className='font-semibold mb-2'>Returns & Exchanges</h3>
          <p className='text-gray-500 text-sm'>
            Easy returns and exchanges within 7 days of delivery.
          </p>
        </div>

        <div className='border p-8 rounded-lg shadow-sm'>
          <h3 className='font-semibold mb-2'>Business Inquiries</h3>
          <p className='text-gray-500 text-sm'>
            For partnerships or collaborations contact us at business@forever.com
          </p>
        </div>

      </div>

    </div>

  )
}

export default Contact