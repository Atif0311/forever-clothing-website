import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='surface-panel my-20 grid gap-4 p-5 text-center text-xs text-[#43382f] sm:grid-cols-3 sm:text-sm md:p-8 md:text-base'>

      <div className='rounded-2xl bg-[#f4efe6]/70 p-7'>
        <img className='m-auto mb-5 w-11 opacity-75' src={assets.exchange_icon} alt="" />
        <p className='font-semibold'>Easy Exchange Policy</p>
        <p className='mt-2 text-sm text-[#7b7165]'>Hassle-free exchanges made simple.</p>
      </div>
      <div className='rounded-2xl bg-[#f4efe6]/70 p-7'>
        <img className='m-auto mb-5 w-11 opacity-75' src={assets.quality_icon} alt="" />
        <p className='font-semibold'>7 Days Return Policy</p>
        <p className='mt-2 text-sm text-[#7b7165]'>Seven days to make sure it feels right.</p>
      </div>
      <div className='rounded-2xl bg-[#f4efe6]/70 p-7'>
        <img className='m-auto mb-5 w-11 opacity-75' src={assets.support_img} alt="" />
        <p className='font-semibold'>Best customer support</p>
        <p className='mt-2 text-sm text-[#7b7165]'>Helpful support whenever you need it.</p>
      </div>

    </div>
  )
}

export default OurPolicy
