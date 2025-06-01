"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, Download, AlertCircle, Loader2 } from "lucide-react"
import { downloadInvoicePDF } from "@/lib/pdf-utils"
import { toast } from "sonner"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Invoice {
  id: string
  slug: string
  clientName: string
  clientEmail: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  status: 'draft' | 'unpaid' | 'paid' | 'overdue'
  dueDate?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
    stripeAccountId?: string
    stripeAccountStatus?: string
  }
}

export default function PublicInvoicePage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [error, setError] = useState("")

  const slug = params.slug as string

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/public/invoices/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Invoice not found")
          } else {
            throw new Error("Failed to fetch invoice")
          }
          return
        }

        const data = await response.json()
        setInvoice(data.invoice)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchInvoice()
    }
  }, [slug])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
      case "unpaid":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Unpaid</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>
    }
  }

  const handlePayment = async () => {
    if (!invoice) return

    setIsPaymentLoading(true)
    setPaymentError("")

    try {
      const response = await fetch(`/api/invoices/${invoice.slug}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment session')
      }

      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment'
      setPaymentError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsPaymentLoading(false)
    }
  }

  const downloadPDF = () => {
    if (invoice) {
      downloadInvoicePDF(invoice)
    }
  }

  const canPayInvoice = () => {
    if (!invoice) return false
    if (invoice.status === 'paid') return false
    if (!invoice.user.stripeAccountId) return false
    if (invoice.user.stripeAccountStatus !== 'active') return false
    return true
  }

  const getPaymentMessage = () => {
    if (!invoice) return ""
    if (invoice.status === 'paid') return ""
    if (!invoice.user.stripeAccountId) {
      return "Payment not available - merchant hasn't connected their payment account"
    }
    if (invoice.user.stripeAccountStatus !== 'active') {
      return "Payment not available - merchant's payment account is not active"
    }
    return ""
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-white rounded-lg shadow"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Invoice not found"}
            </h1>
            <p className="text-gray-600">
              This invoice may have been moved or deleted.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Invoice
          </h1>
          <div className="flex justify-center items-center space-x-4">
            {getStatusBadge(invoice.status)}
            <span className="text-gray-600">#{invoice.slug}</span>
          </div>
        </div>

        {/* Invoice Content */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            {/* Invoice Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">From</h2>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{invoice.user.name}</p>
                  <p className="text-gray-600">{invoice.user.email}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">To</h2>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{invoice.clientName}</p>
                  <p className="text-gray-600">{invoice.clientEmail}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                <p className="text-sm font-semibold">{invoice.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Issue Date</p>
                <p className="text-sm">{new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
              {invoice.dueDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Description</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">Qty</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">Rate</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 px-2">
                          <div className="whitespace-pre-wrap text-sm">{item.description}</div>
                        </td>
                        <td className="text-right py-3 px-2 text-sm">{item.quantity}</td>
                        <td className="text-right py-3 px-2 text-sm">
                          {formatCurrency(item.rate, invoice.currency)}
                        </td>
                        <td className="text-right py-3 px-2 text-sm font-medium">
                          {formatCurrency(item.amount, invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>{formatCurrency(invoice.tax, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total, invoice.currency)}</span>
                </div>
              </div>
            </div>

            {/* Payment Status or Actions */}
            {invoice.status === 'paid' ? (
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-600 font-semibold text-lg mb-2">
                  ✓ Payment Received
                </div>
                {invoice.paidAt && (
                  <p className="text-green-700 text-sm">
                    Paid on {new Date(invoice.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="border-t pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Options
                  </h3>
                  
                  {paymentError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-center text-red-700 text-sm">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {paymentError}
                      </div>
                    </div>
                  )}

                  {!canPayInvoice() && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-center text-yellow-700 text-sm">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {getPaymentMessage()}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center space-x-4">
                    <Button 
                      onClick={handlePayment} 
                      size="lg" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!canPayInvoice() || isPaymentLoading}
                    >
                      {isPaymentLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          Pay Now - {formatCurrency(invoice.total, invoice.currency)}
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={downloadPDF}>
                      <Download className="h-5 w-5 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Invoicely</p>
        </div>
      </div>
    </div>
  )
} 