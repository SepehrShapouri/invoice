"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  Shield, 
  Mail,
  Download,
  Palette,
  Clock,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null)

  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    setLoading(true)
    setSelectedPlan(plan)
    
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
      setSelectedPlan(null)
    }
  }

  const features = [
    {
      icon: Zap,
      title: "Unlimited Invoices",
      description: "Send as many invoices as you need",
      free: "1 per month",
      pro: "Unlimited"
    },
    {
      icon: Mail,
      title: "Email Delivery",
      description: "Send invoices directly to clients",
      free: true,
      pro: true
    },
    {
      icon: Download,
      title: "PDF Export",
      description: "Download professional PDF invoices",
      free: true,
      pro: true
    },
    {
      icon: Palette,
      title: "Custom Branding",
      description: "Add your logo and customize colors",
      free: false,
      pro: true
    },
    {
      icon: Shield,
      title: "Priority Support",
      description: "Get help when you need it most",
      free: false,
      pro: true
    },
    {
      icon: Clock,
      title: "Payment Tracking",
      description: "Track payment status and history",
      free: true,
      pro: true
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upgrade to Pro
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock unlimited invoicing and premium features to grow your business faster
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">F</span>
              </div>
              Free Plan
            </CardTitle>
            <CardDescription>Perfect for trying out Invoicely</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">1 invoice per month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Email delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">PDF export</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Payment tracking</span>
              </li>
            </ul>
            <Button variant="outline" disabled className="w-full">
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-purple-200 shadow-lg">
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700">
            Most Popular
          </Badge>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-purple-600" />
              Pro Plan
            </CardTitle>
            <CardDescription>Unlimited invoicing for professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <span className="text-4xl font-bold">$5</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Unlimited invoices</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Everything in Free</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Custom branding</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => handleUpgrade('monthly')}
                disabled={loading}
              >
                {loading && selectedPlan === 'monthly' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Upgrade Monthly
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-purple-300 hover:bg-purple-50"
                onClick={() => handleUpgrade('annual')}
                disabled={loading}
              >
                {loading && selectedPlan === 'annual' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Upgrade Annual (Save $10/year)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>
            See exactly what's included in each plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{feature.title}</p>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          <span className="text-sm">{feature.free}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          <span className="text-sm font-medium">{feature.pro}</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div>
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-gray-600">
              Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-sm text-gray-600">
              We accept all major credit cards and debit cards through our secure payment processor, Stripe.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-sm text-gray-600">
              We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-sm text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time through your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 