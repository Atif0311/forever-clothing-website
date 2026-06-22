import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='surface-panel mb-6 mt-28 overflow-hidden bg-gradient-to-br from-[#17130f] via-[#2f281f] to-[#4e563d] text-white'>
      <div className='flex flex-col gap-14 px-7 py-12 text-sm sm:grid sm:grid-cols-[3fr_1fr_1fr] sm:px-10'>

        <div>
          <img className='mb-5 w-32 rounded bg-[#fffaf2] p-2' src={assets.logo} alt="" />
          <p className='w-full leading-7 text-white/60 md:w-2/3'>Thoughtful fashion for modern wardrobes, with refined silhouettes and easy everyday pieces.</p>
        </div>

        <div>
          <p className='mb-5 text-xs font-semibold tracking-[0.18em] text-[#d6b46a]'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-white/60'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='mb-5 text-xs font-semibold tracking-[0.18em] text-[#d6b46a]'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-white/60'>
            <li>+1-212-456-7890</li>
            <li>Contact@foreveryou.com</li>
          </ul>
        </div>

      </div>

      <div className='border-t border-white/10'>
        <p className='py-5 text-center text-xs tracking-[0.08em] text-white/45'>Copyright 2026 Forever. All rights reserved.</p>
      </div>

    </footer>
  )
}

export default Footer
