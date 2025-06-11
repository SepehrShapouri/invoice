"use client"

import { useState, useEffect, use } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import useInvoice from "@/hooks/use-invoice"
import useSendInvoice from "@/hooks/use-send-invoice"

interface InvoiceViewPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function InvoiceViewPage({ params }: InvoiceViewPageProps) {
  const { slug } = use(params)
  const router = useRouter()
  const { data: session } = useSession()
  const { data: invoice, isLoading: isLoadingInvoice, isError: isErrorInvoice, error: invoiceError } = useInvoice(slug)
  const { mutate: sendInvoice, isPending: isSendingInvoice, isSuccess: isSuccessInvoice, isError: isErrorInvoiceSending, error: invoiceErrorSending } = useSendInvoice()

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

  if (isLoadingInvoice) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Skeleton className="h-9 w-32" /> {/* Back button */}
            </div>
            <Skeleton className="h-8 w-48 mb-2" /> {/* Invoice # */}
            <Skeleton className="h-4 w-36" /> {/* Created date */}
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-6 w-20" /> {/* Status badge */}
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-28" /> {/* Action button */}
              <Skeleton className="h-9 w-28" /> {/* Action button */}
              <Skeleton className="h-9 w-28" /> {/* Action button */}
            </div>
          </div>
        </div>

        {/* Invoice Content Skeleton */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Invoice Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <Skeleton className="h-6 w-24 mb-4" /> {/* From label */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" /> {/* Name */}
                  <Skeleton className="h-5 w-48" /> {/* Email */}
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-24 mb-4" /> {/* To label */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" /> {/* Client name */}
                  <Skeleton className="h-5 w-48" /> {/* Client email */}
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <Skeleton className="h-6 w-32 mb-4" /> {/* Items label */}
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-96" /> {/* Description */}
                    <div className="flex space-x-8">
                      <Skeleton className="h-4 w-16" /> {/* Qty */}
                      <Skeleton className="h-4 w-24" /> {/* Rate */}
                      <Skeleton className="h-4 w-24" /> {/* Amount */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" /> {/* Title */}
            <Skeleton className="h-4 w-64" /> {/* Description */}
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-32" /> {/* Action button */}
              <Skeleton className="h-10 w-32" /> {/* Action button */}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isErrorInvoice || !invoice) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {invoiceError?.message || "Invoice not found"}
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
              {invoice.tax && invoice.tax > 0 && (
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
            {isSuccessInvoice && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                Invoice sent successfully to {invoice.clientEmail}
              </div>
            )}
            {isErrorInvoiceSending && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {invoiceErrorSending?.message}
              </div>
            )}
            <div className="flex space-x-4">
              <Button onClick={() => sendInvoice(slug)} disabled={isSendingInvoice}>
                <Send className="h-4 w-4 mr-2" />
                {isSendingInvoice ? 'Sending...' : 'Send to Client'}
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