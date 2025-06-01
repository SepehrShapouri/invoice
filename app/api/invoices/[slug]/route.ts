import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params

    // Find the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { 
        slug,
        userId: session.user.id // Ensure user can only access their own invoices
      },
      select: {
        id: true,
        slug: true,
        clientName: true,
        clientEmail: true,
        items: true,
        subtotal: true,
        tax: true,
        total: true,
        currency: true,
        status: true,
        dueDate: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    // Parse the items JSON
    const parsedInvoice = {
      ...invoice,
      items: JSON.parse(invoice.items as string)
    }

    return NextResponse.json({
      success: true,
      invoice: parsedInvoice
    })

  } catch (error) {
    console.error("Fetch invoice error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 