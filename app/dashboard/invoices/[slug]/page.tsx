"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Download, Send, Eye, Copy } from "lucide-react"
import Link from "next/link"
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
}

export default function InvoiceViewPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const slug = params.slug as string

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${slug}`)
        
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
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "unpaid":
        return <Badge className="bg-yellow-100 text-yellow-800">Unpaid</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
    }
  }

  const copyInvoiceLink = () => {
    const publicUrl = `${window.location.origin}/invoice/${slug}`
    navigator.clipboard.writeText(publicUrl)
    toast.success("Invoice link copied to clipboard!")
  }

  const downloadPDF = () => {
    if (invoice && session?.user) {
      downloadInvoicePDF(invoice, session.user.name, session.user.email)
      toast.success("PDF downloaded successfully!")
    }
  }

  const sendToClient = async () => {
    if (!invoice) return
    
    setIsSending(true)
    setError("")
    
    try {
      const response = await fetch(`/api/invoices/${invoice.slug}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send invoice')
      }
      
      toast.success(`Invoice sent successfully to ${invoice.clientEmail}`)
      
      // Refresh invoice data
      const updatedResponse = await fetch(`/api/invoices/${slug}`)
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json()
        setInvoice(updatedData.invoice)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invoice'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Invoice not found"}
          </h1>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invoice #{invoice.slug}
          </h1>
          <p className="text-sm text-gray-600">
            Created on {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {getStatusBadge(invoice.status)}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={copyInvoiceLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Link href={`/invoice/${invoice.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={downloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">From</h2>
              <div className="text-sm">
                <p className="font-medium">{session?.user?.name}</p>
                <p className="text-gray-600">{session?.user?.email}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">To</h2>
              <div className="text-sm">
                <p className="font-medium">{invoice.clientName}</p>
                <p className="text-gray-600">{invoice.clientEmail}</p>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500">Invoice Number</p>
              <p className="text-sm">{invoice.slug}</p>
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
          <div className="flex justify-end">
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
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {invoice.status === 'unpaid' && (
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>Send this invoice to your client for payment</CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="flex space-x-4">
              <Button onClick={sendToClient} disabled={isSending}>
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send to Client'}
              </Button>
              <Button variant="outline">
                Create Payment Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 