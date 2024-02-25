import Navbar from "@/components/dashboard/navbar"
import NavigationSidebar from "@/components/navigation/navigation-sidebar"
import Sidebar from "@/components/sidebar/sidebar"

const DashboardLayout = async ({children}: { children: React.ReactNode }) => {
    return (
      <div className="h-full flex">
         <Sidebar/>
        <main className="flex-1 h-full">
        <Navbar/>
        {children}
        </main>
      </div>
    )
  }
  
  export default DashboardLayout