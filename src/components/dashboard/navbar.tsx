'use client'

import { ThemeSwitcher } from "../global/theme-switcher"

const Navbar = () => {
  return (
    <nav className="hidden sm:flex w-full h-[60px] dark:bg-[#363636] bg-[#F2F3F5]">
      <div className="flex flex-1 justify-end items-center">
        <div>
            {/* TODO: User avatar */}
        </div>
          <div className="px-4">
            <ThemeSwitcher/>
          </div>
      </div>
    </nav>
  )
}

export default Navbar