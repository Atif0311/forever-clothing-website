import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>

      <div className='page-divider border-t pt-10 text-center text-2xl'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='surface-panel mb-28 mt-10 flex flex-col justify-center gap-10 p-6 md:flex-row md:p-9'>
        <img className='w-full rounded-2xl object-cover md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className=' font-semibold text-xl text-gray-600'>Our Store</p>
          <p className=' text-gray-500'>54709 Willms Station <br /> Suite 350, Washington, USA</p>
          <p className=' text-gray-500'>Tel: (415) 555-0132 <br /> Email: greatstackdev@gmail.com</p>
          <p className=' font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className=' text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='primary-action px-8 py-4 text-sm'>Explore Jobs</button>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default Contact
