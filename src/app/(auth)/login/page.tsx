import LoginForm from "@/components/auth/login-form"
import { currentUser } from "@/lib/auth/get-server-session"

const LoginPage = async () => {
  const user = await currentUser()
  console.log(user?.id)
  return (
    <div className="w-full flex sm:justify-center items-center h-full">
      <LoginForm/>
    </div>
  )
}

export default LoginPage