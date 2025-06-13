// User types
export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripeAccountId?: string
  plan: 'free' | 'pro'
  invoicesSentThisMonth: number
  createdAt: Date
  updatedAt: Date
}

// Invoice types
export interface Invoice {
  id: string
  slug: string
  userId: string
  clientName: string
  clientEmail: string
  items: InvoiceItem[]
  subtotal: number
  tax?: number
  total: number
  currency: string
  status: 'draft' | 'unpaid' | 'paid' | 'overdue'
  dueDate?: Date
  paidAt?: Date
  stripePaymentIntentId?: string
  stripeCheckoutSessionId?: string
  createdAt: Date
  updatedAt: Date
  user?: {
    name: string
    email: string
    stripeAccountId?: string
    stripeAccountStatus?: string
  }
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

// Form types
export interface CreateInvoiceData {
  clientName: string
  clientEmail: string
  items: InvoiceItem[]
  dueDate?: Date
  taxRate?: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Stripe types
export interface StripeCheckoutSession {
  url: string
  sessionId: string
}

// Dashboard stats
export interface DashboardStats {
  totalInvoices: number
  paidInvoices: number
  totalRevenue: number
  invoicesThisMonth: number
} 