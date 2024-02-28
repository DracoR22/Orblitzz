import { BotIcon, BrainIcon, CreditCardIcon, GlobeIcon, InfoIcon, MailIcon, ReplyIcon, SettingsIcon } from "lucide-react"
import { useParams, usePathname } from "next/navigation"
import { useMemo } from "react"

export const useRoutes = () => {
    const pathname = usePathname()
    const params = useParams()

    const routes = useMemo(() => [
          {
            name: 'Posts',
            href: `/dashboard/${params.projectId}/posts`,
            icon: GlobeIcon,
            isActive: pathname === `/dashboard/${params.projectId}/posts`
          },
          {
            name: 'Keywords',
            href: `/dashboard/${params.projectId}/keywords`,
            icon: BrainIcon,
            isActive: pathname === `/dashboard/${params.projectId}/keywords`
          },
          {
            name: 'Replies',
            href: `/dashboard/${params.projectId}/replies`,
            icon: BotIcon,
            isActive: pathname === `/dashboard/${params.projectId}/replies`
          },
          {
            name: 'Settings',
            href: `/dashboard/${params.projectId}/settings`,
            icon: SettingsIcon,
            isActive: pathname === `/dashboard/${params.projectId}/settings`,
          },
          {
            name: 'Billing',
            href: `/dashboard/billing`,
            icon: CreditCardIcon,
            isActive: pathname === `/dashboard/billing`,
          },
          {
            name: 'Contact',
            href: '/dashboard/contact',
            icon: MailIcon,
            isActive: pathname === `/dashboard/contact`,
          },
    ], [pathname])

    return routes
}