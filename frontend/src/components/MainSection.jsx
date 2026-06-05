import React from 'react'
import Chat from './Chat'
import MainHeader from './MainHeader'
import Landing from './Landing'

const MainSection = () => {
  return (
    <div className="w-[97%] mt-1 md:mt-0 flex flex-col gap-2">
      <MainHeader/>
      <Landing />
    </div>
  )
}

export default MainSection
