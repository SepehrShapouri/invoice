"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
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
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Settings,
  LogOut,
  User,
  TrendingUp,
  Crown,
  Sun,
  Moon,
  LucideToggleLeft,
} from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useInvoices from "@/hooks/use-invoices";
import useUserSubscription from "@/hooks/use-userSubscription";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: FileText,
    exact: false,
  },
  {
    title: "Create Invoice",
    url: "/dashboard/new",
    icon: Plus,
    exact: true,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    exact: true,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { data: userSubscription, isLoading: isLoadingUserSubscription } =
    useUserSubscription();
  // TODO: add a endpoint to just get the invoice count
  const { data: invoices } = useInvoices();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const isActive = (url: string, exact: boolean) => {
    if (exact) {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };

  const isPro = userSubscription?.plan !== "free" && !isLoadingUserSubscription;

  // Build dynamic settings items based on subscription
  const dynamicSettingsItems = [
    ...settingsItems,
    ...(isPro
      ? []
      : [
          {
            title: "Upgrade to Pro",
            url: "/dashboard/upgrade",
            icon: TrendingUp,
            exact: true,
          },
        ]),
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">
              Invoicely
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url, item.exact);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.title === "Invoices" &&
                          invoices?.length &&
                          invoices?.length > 0 && (
                            <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {invoices?.length}
                            </span>
                          )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoadingUserSubscription ? (
                <SidebarMenuItem>
                  <Skeleton className="h-8 w-full bg-gray-200" />
                </SidebarMenuItem>
              ) : (
                dynamicSettingsItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.url, item.exact);

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
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center space-x-3 px-2 py-2 w-full">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {isPro ? (
                        <Crown className="h-4 w-4 text-purple-600" />
                      ) : (
                        <User className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-sm font-medium text-sidebar-foreground truncate">
                        {isLoadingUserSubscription ? (
                          <Skeleton className="h-4 w-22 mb-2 bg-gray-200" />
                        ) : (
                          session?.user?.name
                        )}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-sidebar-foreground/60">
                          {isLoadingUserSubscription ? (
                            <Skeleton className="h-3 w-16 bg-gray-200" />
                          ) : isPro ? (
                            "Pro Plan"
                          ) : (
                            "Free Plan"
                          )}
                        </span>
                        {isPro && <Crown className="h-3 w-3 text-purple-600" />}
                      </div>
                    </div>
                    <DropdownMenuTrigger asChild>
                      <IconDotsVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40 mt-1">
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
