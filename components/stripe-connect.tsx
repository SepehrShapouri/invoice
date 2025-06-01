"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, CreditCard, ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface StripeConnectProps {
  showTitle?: boolean
  onStatusChange?: (status: string) => void
}

interface StripeStatus {
  accountId: string | null
  status: string | null
  onboardingUrl: string | null
  isConnected: boolean
}

export function StripeConnect({ showTitle = true, onStatusChange }: StripeConnectProps) {
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchStripeStatus = async () => {
    try {
      const response = await fetch("/api/stripe/connect")
      if (response.ok) {
        const data = await response.json()
        setStripeStatus(data)
        onStatusChange?.(data.status)
      }
    } catch (error) {
      console.error("Failed to fetch Stripe status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const response = await fetch("/api/stripe/connect", { method: "POST" })
      if (response.ok) {
        const data = await response.json()
        if (data.onboardingUrl) {
          // Open Stripe onboarding in same tab
          window.location.href = data.onboardingUrl
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to connect Stripe account")
      }
    } catch (error) {
      toast.error("Failed to connect Stripe account")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/stripe/connect/status", { method: "POST" })
      if (response.ok) {
        const data = await response.json()
        setStripeStatus(prev => prev ? { ...prev, status: data.status } : null)
        onStatusChange?.(data.status)
        
        if (data.status === 'active') {
          toast.success("Stripe account is now active!")
        }
      }
    } catch (error) {
      toast.error("Failed to refresh status")
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending Setup
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <CreditCard className="h-3 w-3 mr-1" />
            Not Connected
          </Badge>
        )
    }
  }

  useEffect(() => {
    fetchStripeStatus()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        {showTitle && (
          <>
            <CardTitle className="flex items-center justify-between">
              Payment Setup
              {stripeStatus && getStatusBadge(stripeStatus.status)}
            </CardTitle>
            <CardDescription>
              Connect your Stripe account to receive payments from invoices
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!stripeStatus?.accountId ? (
          <>
            <p className="text-sm text-gray-600">
              To receive payments from your invoices, you'll need to connect a Stripe account. 
              This allows clients to pay you directly via credit card.
            </p>
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Connect Stripe Account
                </>
              )}
            </Button>
          </>
        ) : stripeStatus.status === "pending" ? (
          <>
            <p className="text-sm text-gray-600">
              Your Stripe account setup is incomplete. Complete the onboarding process to start receiving payments.
            </p>
            <div className="flex gap-2">
              {stripeStatus.onboardingUrl && (
                <Button asChild>
                  <a href={stripeStatus.onboardingUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Complete Setup
                  </a>
                </Button>
              )}
              <Button variant="outline" onClick={handleRefreshStatus} disabled={isRefreshing}>
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : stripeStatus.status === "active" ? (
          <>
            <p className="text-sm text-green-600">
              ✅ Your Stripe account is connected and ready to receive payments!
            </p>
            <Button variant="outline" onClick={handleRefreshStatus} disabled={isRefreshing}>
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Status
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              There was an issue with your Stripe account. Please try connecting again.
            </p>
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                "Reconnect Stripe"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
} 