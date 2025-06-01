"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, CreditCard, DollarSign, Zap, ArrowRight, X } from "lucide-react"
import { StripeConnect } from "@/components/stripe-connect"

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [stripeStatus, setStripeStatus] = useState<string | null>(null)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    onComplete?.()
    onClose()
  }

  const handleStripeStatusChange = (status: string) => {
    setStripeStatus(status)
    if (status === 'active') {
      setTimeout(() => {
        onComplete?.()
        onClose()
      }, 2000)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Invoicely!</h2>
              <p className="text-gray-600">
                Let's get you set up to create and send professional invoices in minutes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Create Beautiful Invoices</p>
                  <p className="text-sm text-gray-600">Professional templates with automatic calculations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Get Paid Faster</p>
                  <p className="text-sm text-gray-600">Accept credit card payments directly on invoices</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Track Everything</p>
                  <p className="text-sm text-gray-600">Monitor payment status and invoice history</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleNext} className="flex-1">
                <ArrowRight className="h-4 w-4 mr-2" />
                Get Started
              </Button>
              <Button variant="outline" onClick={handleSkip}>
                Skip Tour
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Accept Payments</h2>
              <p className="text-gray-600">
                Connect your Stripe account to start receiving payments from clients.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Why connect Stripe?</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Receive payments directly to your account</li>
                    <li>• Support for all major credit cards</li>
                    <li>• Secure and PCI compliant</li>
                    <li>• No platform fees from Invoicely</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleNext} className="flex-1">
                <ArrowRight className="h-4 w-4 mr-2" />
                Connect Now
              </Button>
              <Button variant="outline" onClick={handleSkip}>
                Skip for Now
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Stripe Account</h2>
              <p className="text-gray-600">
                This step is optional but recommended to start receiving payments immediately.
              </p>
            </div>

            <StripeConnect showTitle={false} onStatusChange={handleStripeStatusChange} />

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleSkip} className="flex-1">
                Skip for Now
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">Step {step} of 3</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {renderStep()}
      </DialogContent>
    </Dialog>
  )
} 