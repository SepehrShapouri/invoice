"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateInvoiceTotals, generateInvoiceSlug } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export default function NewInvoicePage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  // Form state
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Invoice items state
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ])

  // Calculate totals
  const { subtotal, tax, total } = calculateInvoiceTotals(items, taxRate)

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    }
    setItems([...items, newItem])
  }

  // Remove item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  // Update item
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        // Recalculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate
        }
        return updated
      }
      return item
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate form
      if (!clientName.trim() || !clientEmail.trim()) {
        throw new Error("Client name and email are required")
      }

      if (items.some(item => !item.description.trim())) {
        throw new Error("All items must have a description")
      }

      // Create invoice data
      const invoiceData = {
        slug: generateInvoiceSlug(),
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        items: items.filter(item => item.description.trim()),
        subtotal,
        tax,
        total,
        currency: "usd",
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes.trim(),
      }

      // Send to API
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create invoice")
      }

      const { invoice } = await response.json()
      
      // Redirect to invoice view
      router.push(`/dashboard/invoices/${invoice.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add client details and line items to generate a professional invoice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Enter your client's details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="Acme Corp"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Client Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="billing@acme.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Invoice Items</CardTitle>
                <CardDescription>Add services or products to your invoice</CardDescription>
              </div>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-12 md:col-span-5">
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Textarea
                      id={`description-${item.id}`}
                      placeholder="Web development services..."
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label htmlFor={`quantity-${item.id}`}>Qty</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label htmlFor={`rate-${item.id}`}>Rate</Label>
                    <Input
                      id={`rate-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <Label>Amount</Label>
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                      ${item.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Invoice Totals */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({taxRate}%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Optional notes for your client</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Payment terms, project details, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  )
} 