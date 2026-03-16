import React from 'react'

const NewsletterBox = () => {
    const onSumbitHandler=(e)=>{
        e.preventDefault();
        // handle the form submission logic here, such as sending the email to a server or displaying a success message
    }
  return (
    <div className='text-center'>
        <p className='text-gray-800 text-2xl font-semibold'>Subscribe now and get 20% off on your first purchase!</p>
        <p className='text-gray-400 t-3'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam fugit nam natus ipsa adipisci nostrum vero provident ex non corporis 
        </p>
        <form onSubmit={onSumbitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input className='w-full sm:flex-1 outline-none ' type='email' placeholder='Enter your email' required />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsletterBox