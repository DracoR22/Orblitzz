import Navbar from '@/components/landing-page/navbar'
import React, { PropsWithChildren } from 'react'

const LandingPageLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='h-full'>
      <Navbar/>
      <main className='h-full pt-[200px] mx-auto md:px-20'>
         {children}
      </main>
    </div>
  )
}

export default LandingPageLayout