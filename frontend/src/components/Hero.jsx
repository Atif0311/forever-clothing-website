import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <div className='surface-panel mt-8 flex flex-col overflow-hidden sm:min-h-[560px] sm:flex-row'>

            {/* Hero Left Side */}
            <div className='relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#fffaf2] via-[#f4efe6] to-[#ded6c5] px-8 py-14 sm:w-1/2 sm:px-12 sm:py-0'>
                <div className='absolute -left-20 -top-20 h-60 w-60 rounded-full border border-[#d6b46a]/35'></div>
                <div className='absolute bottom-10 right-8 h-24 w-24 rounded-full bg-[#6f7758]/10 blur-xl'></div>
                <div className='text-[#43382f]'>
                    <div className='flex items-center gap-2'>
                        <p className='h-[2px] w-8 bg-[#6f7758] md:w-11'></p>
                        <p className='text-sm font-medium tracking-[0.2em] text-[#6f7758] md:text-base'>MODERN EDIT</p>
                    </div>

                    <h1 className='prata-regular max-w-md text-4xl leading-tight sm:py-5 lg:text-6xl'>Modern pieces, quietly distinctive.</h1>

                    <Link to="/collection" className='primary-action mt-5 inline-flex items-center gap-3 px-6 py-3 text-xs font-semibold tracking-[0.16em]'>
                        SHOP THE EDIT
                        <span aria-hidden="true">{"\u2192"}</span>
                    </Link>
                </div>
            </div>

            {/* Hero Right Side */}
            <div className='relative w-full bg-[#d9cfbc] sm:flex sm:w-1/2 sm:items-center sm:justify-center'>
                <img
                    className='h-[380px] w-full object-cover object-top sm:h-[560px]'
                    src={assets.hero_img}
                    alt="Male model in neutral fashion styling"
                />
                <div className='absolute bottom-5 right-5 rounded-full border border-white/35 bg-[#17130f]/65 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-white backdrop-blur'>
                    FOREVER / 2026
                </div>
            </div>
        </div>
    )
}

export default Hero
