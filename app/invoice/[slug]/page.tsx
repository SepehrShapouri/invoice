"use client";

import { useState, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Download, AlertCircle, Loader2 } from "lucide-react";
import { downloadInvoicePDF } from "@/lib/pdf-utils";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import usePublicInvoice from "@/hooks/use-public-invoice";
import { Skeleton } from "@/components/ui/skeleton";

interface InvoicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PublicInvoicePage({ params }: InvoicePageProps) {
  const { slug } = use(params);
  const { data: session, isPending: isPendingSession } = useSession();
  const {
    data: invoice,
    isLoading: isLoadingInvoice,
    isError: isErrorInvoice,
    error: invoiceError,
  } = usePublicInvoice(slug);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Paid
          </Badge>
        );
      case "unpaid":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Unpaid
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Draft
          </Badge>
        );
    }
  };

  const handlePayment = async () => {
    if (!invoice) return;

    setIsPaymentLoading(true);
    setPaymentError("");

    try {
      const response = await fetch(`/api/invoices/${invoice.slug}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process payment";
      setPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const downloadPDF = () => {
    if (invoice) {
      downloadInvoicePDF(invoice, session?.user?.name, session?.user?.email);
    }
  };

  const canPayInvoice = () => {
    if (!invoice || !invoice.user) return false;
    if (invoice.status === "paid") return false;
    if (!invoice.user.stripeAccountId) return false;
    if (invoice.user.stripeAccountStatus !== "active") return false;
    return true;
  };

  const getPaymentMessage = () => {
    if (!invoice || !invoice.user) return "";
    if (invoice.status === "paid") return "";
    if (!invoice.user.stripeAccountId) {
      return "Payment not available - merchant hasn't connected their payment account";
    }
    if (invoice.user.stripeAccountStatus !== "active") {
      return "Payment not available - merchant's payment account is not active";
    }
    return "";
  };

  if (isLoadingInvoice || isPendingSession) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-48 mx-auto mb-2" />
            <div className="flex justify-center items-center space-x-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* Invoice Content Skeleton */}
          <Card>
            <CardContent className="p-8">
              {/* Invoice Header Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
              </div>

              {/* Invoice Details Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>

              {/* Invoice Items Skeleton */}
              <div className="mb-8">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-border pb-4"
                    >
                      <Skeleton className="h-4 w-64" />
                      <div className="flex space-x-8">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Totals Skeleton */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                </div>
              </div>

              {/* Payment Actions Skeleton */}
              <div className="border-t border-border pt-6">
                <div className="text-center">
                  <Skeleton className="h-6 w-40 mx-auto mb-4" />
                  <div className="flex justify-center space-x-4">
                    <Skeleton className="h-11 w-48 rounded-md" />
                    <Skeleton className="h-11 w-40 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-48 mx-auto mt-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Skeleton */}
          <div className="text-center mt-8">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (isErrorInvoice || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isErrorInvoice ? invoiceError.message : "Invoice not found"}
            </h1>
            <p className="text-gray-600">
              This invoice may have been moved or deleted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice</h1>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  From
                </h2>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {invoice.user?.name}
                  </p>
                  <p className="text-gray-600">{invoice.user?.email}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">To</h2>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {invoice.clientName}
                  </p>
                  <p className="text-gray-600">{invoice.clientEmail}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Invoice Number
                </p>
                <p className="text-sm font-semibold">{invoice.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Issue Date</p>
                <p className="text-sm">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
              {invoice.dueDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="text-sm">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-500">
                        Description
                      </th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">
                        Qty
                      </th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">
                        Rate
                      </th>
                      <th className="text-right py-3 px-2 font-medium text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 px-2">
                          <div className="whitespace-pre-wrap text-sm">
                            {item.description}
                          </div>
                        </td>
                        <td className="text-right py-3 px-2 text-sm">
                          {item.quantity}
                        </td>
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
                  <span>
                    {formatCurrency(invoice.subtotal, invoice.currency)}
                  </span>
                </div>
                {invoice.tax && invoice.tax > 0 && (
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
            {invoice.status === "paid" ? (
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
                          Pay Now -{" "}
                          {formatCurrency(invoice.total, invoice.currency)}
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
  );
}
