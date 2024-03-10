'use client'

import { ThemeSwitcher } from "../global/theme-switcher"
import UserMenu from "./user-menu"

const Navbar = () => {
  return (
    <nav className="hidden sm:flex w-full h-[60px] dark:bg-[#363636] bg-[#f6f6f6]">
      <div className="flex flex-1 justify-end items-center">
        <div className="pt-1">
            <UserMenu/>
        </div>
          <div className="px-4">
            <ThemeSwitcher/>
          </div>
      </div>
    </nav>
  )
}

export default Navbar