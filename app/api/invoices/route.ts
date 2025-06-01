import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateInvoiceSlug, canCreateInvoice } from "@/lib/utils"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      clientName,
      clientEmail,
      items,
      subtotal,
      tax,
      total,
      currency = "usd",
      dueDate,
      notes
    } = body

    // Validation
    if (!clientName || !clientEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check user's invoice limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        plan: true,
        invoicesSentThisMonth: true,
        subscriptionStatus: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Use canCreateInvoice utility for plan enforcement
    const { canCreate, reason } = canCreateInvoice({
      plan: user.plan,
      invoicesSentThisMonth: user.invoicesSentThisMonth,
      subscriptionStatus: user.subscriptionStatus
    })

    if (!canCreate) {
      return NextResponse.json(
        { error: reason },
        { status: 403 }
      )
    }

    // Generate unique slug
    let slug = generateInvoiceSlug()
    let slugExists = await prisma.invoice.findUnique({ where: { slug } })
    
    while (slugExists) {
      slug = generateInvoiceSlug()
      slugExists = await prisma.invoice.findUnique({ where: { slug } })
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        slug,
        userId: session.user.id,
        clientName,
        clientEmail,
        items: JSON.stringify(items),
        subtotal,
        tax: tax || 0,
        total,
        currency,
        status: "unpaid",
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    })

    // Update user's invoice count (only for free users)
    if (user.plan === 'free') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          invoicesSentThisMonth: {
            increment: 1
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        slug: invoice.slug,
        clientName: invoice.clientName,
        total: invoice.total,
        status: invoice.status,
        createdAt: invoice.createdAt
      }
    })

  } catch (error) {
    console.error("Invoice creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's invoices
    const invoices = await prisma.invoice.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        clientName: true,
        clientEmail: true,
        total: true,
        currency: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      invoices
    })

  } catch (error) {
    console.error("Fetch invoices error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 