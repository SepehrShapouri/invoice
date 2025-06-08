"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Download, 
  MoreHorizontal,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Invoice {
  id: string
  slug: string
  clientName: string
  clientEmail: string
  total: number
  currency: string
  status: 'draft' | 'unpaid' | 'paid' | 'overdue'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export default function InvoicesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [error, setError] = useState("")

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/invoices")
        if (!response.ok) {
          throw new Error("Failed to fetch invoices")
        }
        const data = await response.json()
        setInvoices(data.invoices)
        setFilteredInvoices(data.invoices)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast.error("Failed to load invoices")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  // Filter and search invoices
  useEffect(() => {
    let filtered = invoices

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(invoice => 
        invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchQuery, statusFilter])

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

  const getStatusStats = () => {
    const stats = {
      total: invoices.length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      unpaid: invoices.filter(inv => inv.status === 'unpaid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      draft: invoices.filter(inv => inv.status === 'draft').length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
      paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
      pendingAmount: invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0)
    }
    return stats
  }

  const stats = getStatusStats()

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all your invoices
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button>
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
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
                <p className="text-xs text-gray-500">{formatCurrency(stats.paidAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unpaid + stats.overdue}</p>
                <p className="text-xs text-gray-500">{formatCurrency(stats.pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices by client name, email, or invoice number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Invoices ({filteredInvoices.length})
          </CardTitle>
          <CardDescription>
            {filteredInvoices.length === 0 && invoices.length > 0 
              ? "No invoices match your current filters" 
              : "A list of all your invoices"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {invoices.length === 0 ? "No invoices" : "No matching invoices"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {invoices.length === 0 
                  ? "Get started by creating your first invoice."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {invoices.length === 0 && (
                <div className="mt-6">
                  <Link href="/dashboard/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Invoice</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Client</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Due Date</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">#{invoice.slug}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm text-gray-900">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm text-gray-900">
                          {invoice.dueDate 
                            ? new Date(invoice.dueDate).toLocaleDateString() 
                            : '-'
                          }
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/dashboard/invoices/${invoice.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/invoice/${invoice.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 