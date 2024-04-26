import { BotIcon, BrainIcon, CreditCardIcon, GlobeIcon, InfoIcon, LayoutDashboardIcon, MailIcon, ReplyIcon, SettingsIcon, SquarePenIcon } from "lucide-react"
import { useParams, usePathname } from "next/navigation"
import { useMemo } from "react"

export const useRoutes = () => {
    const pathname = usePathname()
    const params = useParams()

    const routes = useMemo(() => [
          {
            name: 'Dashboard',
            href: `/dashboard/${params.projectId}`,
            icon: LayoutDashboardIcon,
            isActive: pathname === `/dashboard/${params.projectId}`
          },
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
    ], [pathname])

    return routes
}

export const useMarketingRoutes = () => {
  const pathname = usePathname()
  const params = useParams()

  const routes = useMemo(() => [
        {
          name: 'Text Editor',
          href: ``,
          icon: SquarePenIcon,
          isActive: pathname === `/dashboard/${params.projectId}/editor`
        },
  ], [pathname])

  return routes
}

export const useExtraRoutes = () => {
  const pathname = usePathname()
  const params = useParams()

  const routes = useMemo(() => [
        {
          name: 'Billing',
          href: `/dashboard/${params.projectId}/billing`,
          icon: CreditCardIcon,
          isActive: pathname === `/dashboard/billing`,
        },
        // {
        //   name: 'Contact',
        //   href: '/dashboard/contact',
        //   icon: MailIcon,
        //   isActive: pathname === `/dashboard/contact`,
        // },
  ], [pathname])

  return routes
}