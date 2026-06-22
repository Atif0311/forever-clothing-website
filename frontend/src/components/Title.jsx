import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <div className='mb-3 inline-flex items-center gap-3'>
      <p className='text-xs font-semibold tracking-[0.22em] text-[#6f7758] sm:text-sm'>
        {text1} <span className='prata-regular ml-1 text-xl normal-case tracking-normal text-[#2f281f] sm:text-2xl'>{text2}</span>
      </p>
      <p className='h-[2px] w-8 bg-gradient-to-r from-[#d6b46a] to-[#6f7758] sm:w-12'></p>
    </div>
  )
}

export default Title
