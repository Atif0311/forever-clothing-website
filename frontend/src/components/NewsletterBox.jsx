import React from 'react'

const NewsletterBox = () => {
  return (
    <div className='surface-panel my-20 overflow-hidden bg-gradient-to-br from-[#17130f] via-[#2f281f] to-[#4e563d] px-6 py-12 text-center text-white sm:px-12'>

      <p className='prata-regular text-3xl'>A quieter inbox, with better clothes.</p>
      <p className='mt-3 text-sm text-white/65'>Join the edit for new arrivals, styling notes, and 20% off your first order.</p>

      <form className='mx-auto my-7 flex w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1.5 pl-5 sm:w-1/2'>
        <input className='w-full border-none bg-transparent text-white placeholder:text-white/45 focus:shadow-none sm:flex-1' type="text" placeholder='Enter your email address' required />
        <button className='rounded-full bg-[#d6b46a] px-7 py-3 text-xs font-semibold text-[#17130f]' type='submit'>SUBSCRIBE</button>
      </form>

    </div>
  )
}

export default NewsletterBox
