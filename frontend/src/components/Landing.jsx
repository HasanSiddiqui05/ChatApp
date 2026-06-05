import React from 'react'
import Chatting from '@/assets/Chatting.png'

const Landing = () => {
  return (
    <div className='w-full h-[600px] flex gap-3 border-2 items-center justify-center flex-col rounded-xl'>
        <img src={Chatting} className='lg:w-1/3 md:w-1/2 w-2/3' alt="Chat illustration" />
        <p className='font-medium lg:text-3xl text-2xl'>Start Using ChatApp</p>
        <p className='font-medium lg:text-xl text-lg text-gray-600 w-1/2 text-center'>
          Connect instantly, chat securely, and make your online conversations simpler
        </p>
    </div>
  )
}

export default Landing
