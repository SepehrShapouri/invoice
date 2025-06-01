"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StripeConnect } from "@/components/stripe-connect"
import { SubscriptionManagement } from "@/components/subscription-management"
import { toast } from "sonner"

export default function SettingsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [userPlan, setUserPlan] = useState<string>('Free Plan')

  useEffect(() => {
    // Fetch subscription data
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch('/api/user/subscription')
        if (response.ok) {
          const data = await response.json()
          const plan = data.subscription?.plan || 'free'
          
          // Format plan display
          if (plan === 'free') {
            setUserPlan('Free Plan')
          } else if (data.subscription?.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID) {
            setUserPlan('Pro Plan (Annual)')
          } else {
            setUserPlan('Pro Plan (Monthly)')
          }
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error)
      }
    }

    if (session?.user) {
      fetchSubscriptionData()
    }

    // Handle Stripe Connect return flows
    const stripeParam = searchParams.get("stripe")
    const subscriptionParam = searchParams.get("subscription")
    
    if (stripeParam === "return") {
      toast.success("Welcome back! Please refresh your Stripe status to see updates.")
    } else if (stripeParam === "refresh") {
      toast.info("Please complete your Stripe account setup to start receiving payments.")
    }

    // Handle subscription flows
    if (subscriptionParam === "success") {
      toast.success("Welcome to Pro! Your subscription is now active.")
      // Refresh subscription data after successful upgrade
      setTimeout(() => {
        fetchSubscriptionData()
      }, 1000)
    } else if (subscriptionParam === "cancelled") {
      toast.info("Subscription setup was cancelled. You can try again anytime.")
    }
  }, [searchParams, session])

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