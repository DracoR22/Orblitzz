import Navbar from '@/components/landing-page/navbar'
import React, { PropsWithChildren } from 'react'

const LandingPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='h-full'>
      <Navbar/>
      <main className='h-full pt-[150px] mx-auto md:px-[100px]'>
         {children}
      </main>
    </div>
  )
}

export default LandingPageLayout