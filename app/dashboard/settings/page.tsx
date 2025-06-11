"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StripeConnect } from "@/components/stripe-connect"
import { SubscriptionManagement } from "@/components/subscription-management"
import { toast } from "sonner"
import useUserSubscription from "@/hooks/use-userSubscription"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [userPlan, setUserPlan] = useState<string>('Free Plan')
  const { data: userSubscription, isLoading: isLoadingUserSubscription } = useUserSubscription()

  const plan = userSubscription?.plan || 'free'

  useEffect(() => {
    if (isLoadingUserSubscription) return

    if (plan === 'free') {
      setUserPlan('Free Plan')
    } else if (userSubscription?.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID) {
      setUserPlan('Pro Plan (Annual)')
    } else {
      setUserPlan('Pro Plan (Monthly)')
    }

    const stripeParam = searchParams.get("stripe")
    const subscriptionParam = searchParams.get("subscription")

    if (stripeParam === "return") {
      toast.success("Welcome back! Please refresh your Stripe status to see updates.")
    } else if (stripeParam === "refresh") {
      toast.info("Please complete your Stripe account setup to start receiving payments.")
    }

    if (subscriptionParam === "success") {
      toast.success("Welcome to Pro! Your subscription is now active.")
    } else if (subscriptionParam === "cancelled") {
      toast.info("Subscription setup was cancelled. You can try again anytime.")
    }

  }, [isLoadingUserSubscription, plan, userSubscription, searchParams, session])

  if (isLoadingUserSubscription) {
    return (
      <div>
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" /> {/* Settings title */}
          <Skeleton className="h-4 w-96" /> {/* Description */}
        </div>

        <div className="space-y-6">
          {/* Account Information Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" /> {/* Card title */}
              <Skeleton className="h-4 w-64" /> {/* Card description */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" /> {/* Label */}
                    <Skeleton className="h-5 w-48" /> {/* Value */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-56 mb-2" /> {/* Card title */}
              <Skeleton className="h-4 w-72" /> {/* Card description */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32 mb-1" /> {/* Plan name */}
                    <Skeleton className="h-4 w-48" /> {/* Plan description */}
                  </div>
                  <Skeleton className="h-9 w-28" /> {/* Action button */}
                </div>
                <Skeleton className="h-4 w-full" /> {/* Additional info */}
              </div>
            </CardContent>
          </Card>

          {/* Stripe Connect Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" /> {/* Card title */}
              <Skeleton className="h-4 w-80" /> {/* Card description */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" /> {/* Status message */}
                <Skeleton className="h-9 w-40" /> {/* Connect button */}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Preferences Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" /> {/* Card title */}
              <Skeleton className="h-4 w-64" /> {/* Card description */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-32 mb-2" /> {/* Label */}
                    <Skeleton className="h-5 w-24" /> {/* Value */}
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <Skeleton className="h-4 w-full" /> {/* Future update message */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account settings and payment preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your basic account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm text-gray-900">{session?.user?.name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{session?.user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Plan</label>
                <p className="text-sm text-gray-900">{userPlan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Joined</label>
                <p className="text-sm text-gray-900">
                  {session?.user?.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString()
                    : "Unknown"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Management */}
        <SubscriptionManagement />

        {/* Stripe Connect */}
        <StripeConnect />

        {/* Invoice Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Preferences</CardTitle>
            <CardDescription>
              Customize your invoice defaults
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Default Currency</label>
                <p className="text-sm text-gray-900">USD ($)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Default Tax Rate</label>
                <p className="text-sm text-gray-900">0%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                <p className="text-sm text-gray-900">Net 30</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Invoice Numbering</label>
                <p className="text-sm text-gray-900">Auto-generated</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                Invoice preference customization will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 