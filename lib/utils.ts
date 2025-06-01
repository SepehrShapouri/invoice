import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate random invoice slug
export function generateInvoiceSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Calculate invoice totals
export function calculateInvoiceTotals(items: InvoiceItem[], taxRate: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax
  
  return {
    subtotal,
    tax,
    total
  }
}

// Types
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

// Subscription and plan utilities
export function canCreateInvoice(user: {
  plan: string
  invoicesSentThisMonth: number
  subscriptionStatus?: string | null
}): { canCreate: boolean; reason?: string } {
  // Pro users (monthly/annual) with active subscription can create unlimited invoices
  if (user.plan !== 'free' && user.subscriptionStatus === 'active') {
    return { canCreate: true }
  }

  // Free users can create 1 invoice per month
  if (user.plan === 'free') {
    if (user.invoicesSentThisMonth >= 1) {
      return { 
        canCreate: false, 
        reason: 'Free plan allows 1 invoice per month. Upgrade to Pro for unlimited invoices.' 
      }
    }
    return { canCreate: true }
  }

  // Pro users without active subscription (expired, canceled, etc.)
  return { 
    canCreate: false, 
    reason: 'Your subscription is not active. Please update your payment method or reactivate your subscription.' 
  }
}

export function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case 'free':
      return 'Free'
    case 'monthly':
      return 'Monthly Pro'
    case 'annual':
      return 'Annual Pro'
    default:
      return 'Unknown'
  }
}

export function isProPlan(plan: string): boolean {
  return plan === 'monthly' || plan === 'annual'
}
