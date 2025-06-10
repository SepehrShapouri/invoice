"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  FileText,
  DollarSign,
  Calendar,
  TrendingUp,
  Eye,
  Send,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import useInvoices from "@/hooks/use-invoices"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices()

  console.log("Raw invoices from hook:", invoices)
  console.log("Loading state:", isLoadingInvoices)

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

  const stats = {
    total: invoices?.length || 0,
    paid: invoices?.filter(inv => inv.status === 'paid').length || 0,
    unpaid: invoices?.filter(inv => inv.status === 'unpaid').length || 0,
    overdue: invoices?.filter(inv => inv.status === 'overdue').length || 0,
    totalInvoices: invoices?.length || 0,
    paidInvoices: invoices?.filter(inv => inv.status === 'paid').length || 0,
    unpaidInvoices: invoices?.filter(inv => inv.status === 'unpaid').length || 0,
    overdueInvoices: invoices?.filter(inv => inv.status === 'overdue').length || 0,
    totalRevenue: invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0) || 0,
    pendingAmount: invoices?.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0) || 0,
  }

  const recentInvoices = invoices
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) || []

  if (isLoadingInvoices) {
    return (
      <div className="max-w-7xl w-full mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div>
            <Skeleton className="h-8 w-48 sm:w-64 mb-2" />
            <Skeleton className="h-4 w-64 sm:w-96" />
          </div>
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-20" />
              </div>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="flex gap-2 flex-col">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.name || "User"}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your invoices today.
          </p>
        </div>
        <Link href="/dashboard/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.pendingAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Invoices</CardTitle>
              <Link href="/dashboard/invoices">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>
              Your most recent invoice activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentInvoices?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first invoice.
                </p>
                <div className="mt-6">
                  <Link href="/dashboard/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInvoices?.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            #{invoice.slug}
                          </p>
                          <p className="text-sm text-gray-500">{invoice.clientName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(invoice.status)}
                      <Link href={`/dashboard/invoices/${invoice.slug}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your invoicing
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2 flex-col">
            <Link href="/dashboard/new">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Plus className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Create New Invoice</p>
                  <p className="text-sm text-gray-500">Generate a professional invoice for your client</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/invoices">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">View All Invoices</p>
                  <p className="text-sm text-gray-500">Manage and track all your invoices</p>
                </div>
              </div>
            </Link>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Upgrade to Pro</p>
                <p className="text-sm text-gray-500">Unlimited invoices for just $5/month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 