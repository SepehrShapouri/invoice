"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, CreditCard, Crown } from "lucide-react"
import { toast } from "sonner"

interface SubscriptionData {
  plan: string
  subscriptionStatus?: string
  subscriptionCurrentPeriodStart?: string
  subscriptionCurrentPeriodEnd?: string
  subscriptionCancelAtPeriodEnd?: boolean
  invoicesSentThisMonth: number
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string
}

export function SubscriptionManagement() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [userData, setUserData] = useState<SubscriptionData | null>(null)

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!session?.user) return
      
      try {
        setFetchingData(true)
        const response = await fetch('/api/user/subscription')
        if (response.ok) {
          const data = await response.json()
          setUserData(data.subscription)
        } else {
          console.error('Failed to fetch subscription data')
          // Fallback to default data
          setUserData({
            plan: 'free',
            subscriptionStatus: undefined,
            invoicesSentThisMonth: 0,
            stripeCustomerId: undefined
          })
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error)
        // Fallback to default data
        setUserData({
          plan: 'free',
          subscriptionStatus: undefined,
          invoicesSentThisMonth: 0,
          stripeCustomerId: undefined
        })
      } finally {
        setFetchingData(false)
      }
    }

    fetchSubscriptionData()
  }, [session])

  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Failed to start checkout')
      }
    } catch (error) {
      toast.error('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscriptions/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Failed to open billing portal')
      }
    } catch (error) {
      toast.error('Failed to open billing portal')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing & Subscription
          </CardTitle>
          <CardDescription>
            Manage your Invoicely subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading subscription data...</span>
        </CardContent>
      </Card>
    )
  }

  const isPro = userData?.plan !== 'free'
  const isActive = userData?.subscriptionStatus === 'active'
  const isCanceling = userData?.subscriptionCancelAtPeriodEnd

  // Determine plan display name and pricing
  const getPlanDisplay = () => {
    if (!isPro) return { name: 'Free Plan', price: '$0.00/month' }
    
    if (userData?.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID) {
      return { name: 'Pro Plan (Annual)', price: '$50.00/year' }
    }
    return { name: 'Pro Plan (Monthly)', price: '$5.00/month' }
  }

  const planDisplay = getPlanDisplay()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing & Subscription
        </CardTitle>
        <CardDescription>
          Manage your Invoicely subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {isPro ? (
              <Crown className="h-8 w-8 text-purple-600" />
            ) : (
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">F</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {planDisplay.name}
                </h3>
                {isPro && (
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isCanceling ? 'Canceling' : userData?.subscriptionStatus || 'Unknown'}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {isPro 
                  ? 'Unlimited invoices and premium features'
                  : `${userData?.invoicesSentThisMonth || 0}/1 invoices used this month`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              {planDisplay.price}
            </p>
            {isPro && userData?.subscriptionCurrentPeriodEnd && (
              <p className="text-sm text-gray-600">
                {isCanceling ? 'Ends' : 'Renews'} {new Date(userData.subscriptionCurrentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isPro ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Upgrade to Pro to send unlimited invoices and access premium features
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Monthly Plan */}
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">Monthly</h4>
                    <p className="text-2xl font-bold">$5<span className="text-sm font-normal">/month</span></p>
                  </div>
                  <Badge variant="outline">Popular</Badge>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Unlimited invoices
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Custom branding
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade('monthly')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upgrade Monthly'}
                </Button>
              </div>

              {/* Annual Plan */}
              <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">Annual</h4>
                    <p className="text-2xl font-bold">$50<span className="text-sm font-normal">/year</span></p>
                    <p className="text-sm text-green-600">Save $10/year</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Best Value
                  </Badge>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Everything in Monthly
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    2 months free
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Annual discounts
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUpgrade('annual')}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upgrade Annual'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  {isCanceling ? "Subscription Ending" : "You're all set!"}
                </p>
                <p className="text-sm text-green-700">
                  {isCanceling 
                    ? "Access continues until your billing period ends"
                    : "Enjoying unlimited invoices and premium features"
                  }
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleManageBilling}
              disabled={loading}
              className="border-green-300 hover:bg-green-100"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Manage Billing'}
            </Button>
          </div>
        )}

        {/* Usage Stats for Free Users */}
        {!isPro && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">
                  Free Plan Limits
                </p>
                <p className="text-sm text-amber-700">
                  You can send {1 - (userData?.invoicesSentThisMonth || 0)} more invoice{1 - (userData?.invoicesSentThisMonth || 0) === 1 ? '' : 's'} this month.
                  Upgrade to Pro for unlimited invoicing.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 