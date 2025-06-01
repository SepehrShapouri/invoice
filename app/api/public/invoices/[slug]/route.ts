import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Find the invoice with user info (no auth required for public view)
    const invoice = await prisma.invoice.findUnique({
      where: { slug },
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
        updatedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            stripeAccountId: true,
            stripeAccountStatus: true,
          }
        }
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
    console.error("Fetch public invoice error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 