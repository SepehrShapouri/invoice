"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

interface Invoice {
  id: string
  slug: string
  clientName: string
  clientEmail: string
  total: number
  currency: string
  status: string
  user: {
    name: string
    email: string
  }
}

export default function PaymentSuccessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const slug = params.slug as string
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/public/invoices/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setInvoice(data.invoice)
        } else {
          setError("Invoice not found")
        }
      } catch (err) {
        setError("Failed to load invoice")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchInvoice()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {error || "Invoice not found"}
            </h1>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-green-700 mb-4">
              Thank you for your payment. Your invoice has been marked as paid.
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Amount Paid:</span>
                <span className="text-lg font-bold text-green-900">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
              {sessionId && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-600">Transaction ID:</span>
                  <span className="text-sm text-gray-500 font-mono">
                    {sessionId.slice(-12)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice #{invoice.slug}</CardTitle>
            <CardDescription>
              Payment confirmation for services provided by {invoice.user.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Billed To</h3>
                <p className="text-sm text-gray-600">{invoice.clientName}</p>
                <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Service Provider</h3>
                <p className="text-sm text-gray-600">{invoice.user.name}</p>
                <p className="text-sm text-gray-600">{invoice.user.email}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Payment Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Invoice Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-green-600">PAID</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-600">Payment Date:</span>
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/invoice/${invoice.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    View Invoice
                  </Button>
                </Link>
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center">
              <p className="text-sm text-gray-600">
                Questions about this payment? Contact {invoice.user.name} at{" "}
                <a href={`mailto:${invoice.user.email}`} className="text-blue-600 hover:text-blue-800">
                  {invoice.user.email}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 