"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "@/lib/auth-client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Settings, 
  LogOut,
  User,
  CreditCard,
  TrendingUp,
  Crown
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: FileText,
    exact: false
  },
  {
    title: "Create Invoice",
    url: "/dashboard/new",
    icon: Plus,
    exact: true
  }
]

const settingsItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    exact: true
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [invoiceCount, setInvoiceCount] = useState(0)
  const [userPlan, setUserPlan] = useState<string>('free')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch invoice count
        const invoicesResponse = await fetch("/api/invoices")
        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json()
          setInvoiceCount(invoicesData.invoices?.length || 0)
        }

        // Fetch subscription data
        const subscriptionResponse = await fetch("/api/user/subscription")
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json()
          setUserPlan(subscriptionData.subscription?.plan || 'free')
        }
      } catch (err) {
        console.error("Failed to fetch data:", err)
      }
    }

    if (session?.user) {
      fetchData()
    }
  }, [session])

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/"
        }
      }
    })
  }

  const isActive = (url: string, exact: boolean) => {
    if (exact) {
      return pathname === url
    }
    return pathname.startsWith(url)
  }

  const isPro = userPlan !== 'free'

  // Build dynamic settings items based on subscription
  const dynamicSettingsItems = [
    ...settingsItems,
    ...(isPro ? [] : [{
      title: "Upgrade to Pro",
      url: "/dashboard/upgrade",
      icon: TrendingUp,
      exact: true
    }])
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">Invoicely</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.url, item.exact)
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.title === "Invoices" && invoiceCount > 0 && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {invoiceCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dynamicSettingsItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.url, item.exact)
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.title === "Upgrade to Pro" && (
                          <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            $5/mo
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-3 px-2 py-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {isPro ? (
                  <Crown className="h-4 w-4 text-purple-600" />
                ) : (
                  <User className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {session?.user?.name || "User"}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-sidebar-foreground/60">
                    {isPro ? 'Pro Plan' : 'Free Plan'}
                  </p>
                  {isPro && (
                    <Crown className="h-3 w-3 text-purple-600" />
                  )}
                </div>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="w-full">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
} 
