"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateInvoiceTotals,
  generateInvoiceSlug,
  formatCurrency,
} from "@/lib/utils";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const INVOICE_TEMPLATES = [
  {
    id: "web-dev",
    name: "Web Development",
    items: [
      {
        description: "Frontend Development",
        rate: 75,
        quantity: 1,
      },
      {
        description: "Backend Development",
        rate: 85,
        quantity: 1,
      },
      {
        description: "UI/UX Design",
        rate: 65,
        quantity: 1,
      },
    ],
  },
  {
    id: "consulting",
    name: "Consulting",
    items: [
      {
        description: "Strategy Consulting",
        rate: 150,
        quantity: 1,
      },
      {
        description: "Technical Review",
        rate: 120,
        quantity: 1,
      },
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance",
    items: [
      {
        description: "Monthly Maintenance",
        rate: 500,
        quantity: 1,
      },
      {
        description: "Bug Fixes",
        rate: 95,
        quantity: 1,
      },
    ],
  },
];

export default function NewInvoicePage() {
  const { data: session, isPending: isPendingSession } = useSession();
  const router = useRouter();

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  // Invoice items state
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ]);

  // Calculate totals
  const { subtotal, tax, total } = calculateInvoiceTotals(items, taxRate);

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Update item
  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate amount when quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form
      if (!clientName.trim() || !clientEmail.trim()) {
        throw new Error("Client name and email are required");
      }

      if (items.some((item) => !item.description.trim())) {
        throw new Error("All items must have a description");
      }

      // Create invoice data
      const invoiceData = {
        slug: generateInvoiceSlug(),
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        items: items.filter((item) => item.description.trim()),
        subtotal,
        tax,
        total,
        currency: "usd",
        dueDate: dueDate ?? null,
        notes: notes.trim(),
      };

      // Send to API
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create invoice");
      }

      const { invoice } = await response.json();

      // Redirect to invoice view
      router.push(`/dashboard/invoices/${invoice.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Add template selection handler
  const handleTemplateSelect = (templateId: string) => {
    const template = INVOICE_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      const newItems = template.items.map((item, index) => ({
        id: Date.now().toString() + index,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate,
      }));
      setItems(newItems);
    }
  };

  // Add preview component
  const InvoicePreview = () => (
    <Card className="mb-8">
      <CardContent className="p-8">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row flex-wrap gap-16 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">From</h2>
            {isPendingSession ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-42" />
              </div>
            ) : (
              <div className="text-sm">
                <p className="font-medium">{session?.user?.name}</p>
                <p>{session?.user?.email}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">To</h2>
            <div className="text-sm">
              <p className="font-medium">{clientName || "Client Name"}</p>
              <p className="text-gray-600">
                {clientEmail || "client@email.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-500">Invoice Number</p>
            <p className="text-sm">Preview</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Issue Date</p>
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
          </div>
          {dueDate && (
            <div>
              <p className="text-sm font-medium text-gray-500">Due Date</p>
              <p className="text-sm">{dueDate.toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
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
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="py-3 px-2">
                      <div className="whitespace-pre-wrap text-sm">
                        {item.description}
                      </div>
                    </td>
                    <td className="text-right py-3 px-2 text-sm">
                      {item.quantity}
                    </td>
                    <td className="text-right py-3 px-2 text-sm">
                      {formatCurrency(item.rate, "usd")}
                    </td>
                    <td className="text-right py-3 px-2 text-sm font-medium">
                      {formatCurrency(item.amount, "usd")}
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
              <span>{formatCurrency(subtotal, "usd")}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span>Tax ({taxRate}%):</span>
                <span>{formatCurrency(tax, "usd")}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(total, "usd")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add client details and line items to generate a professional invoice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Client Information Card */}
            <div className="rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Client Information</h2>
                <p className="text-sm text-gray-600">
                  Enter your client's details
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
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
                  <div className="flex flex-col gap-3">
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
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date" className="px-1">
                      Due Date
                    </Label>
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                      <PopoverTrigger className="bg-secondary" asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-full justify-between font-normal"
                        >
                          {dueDate
                            ? dueDate.toLocaleDateString()
                            : "Select date"}
                          <CalendarIcon className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="center"
                        side="bottom"
                      >
                        <Calendar
                          required
                          mode="single"
                          selected={dueDate}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDueDate(date);
                            setOpenDate(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0"
                      value={taxRate}
                      onChange={(e) =>
                        setTaxRate(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Template</CardTitle>
                <CardDescription>
                  Select a template to quickly add common items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVOICE_TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Invoice Items</h2>
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-4">
                <div className="border-b border-border pb-4 hidden md:grid md:grid-cols-12 gap-4 items-center">
                  <strong className="col-span-5">Description</strong>
                  <strong className="col-span-2">Qty</strong>
                  <strong className="col-span-2">Rate</strong>
                  <strong className="col-span-2">Amount</strong>
                  <div className="col-span-1"></div>
                </div>
                <div className="space-y-6 md:space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start md:items-start border-b pb-4 md:border-0 md:pb-0"
                    >
                      <div className="col-span-1 md:col-span-5">
                        <div className="flex flex-col gap-2">
                          <Label className="md:hidden">Description</Label>
                          <Textarea
                            id={`description-${item.id}`}
                            placeholder="Web development services..."
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, "description", e.target.value)
                            }
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 col-span-1 md:col-span-6">
                        <div className="col-span-1 md:col-span-2">
                          <div className="flex flex-col gap-2">
                            <Label className="md:hidden">Qty</Label>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <div className="flex flex-col gap-2">
                            <Label className="md:hidden">Rate</Label>
                            <Input
                              id={`rate-${item.id}`}
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={item.rate}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "rate",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <div className="flex flex-col gap-2">
                            <Label className="md:hidden">Amount</Label>
                            <div className="px-3 py-2 bg-secondary rounded-md text-sm">
                              ${item.amount.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-1 flex justify-end md:justify-start">
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
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 border-t pt-6">
              <h2 className="text-lg font-semibold">Additional Notes</h2>
              <p className="text-sm text-gray-600">
                Optional notes for your client
              </p>
              <Textarea
                placeholder="Payment terms, project details, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

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

        {/* Live Preview */}
        <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Live Preview
              </h2>
              <p className="text-sm text-gray-600">
                See how your invoice will look
              </p>
            </div>
            <div className="p-4">
              <InvoicePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
