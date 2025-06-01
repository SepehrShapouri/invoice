import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendInvoiceEmail } from "@/lib/email"
import { headers } from "next/headers"

export async function POST(
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
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
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

    // Send email
    await sendInvoiceEmail({
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      invoiceSlug: invoice.slug,
      total: invoice.total,
      currency: invoice.currency,
      senderName: invoice.user.name || 'Unknown',
      senderEmail: invoice.user.email
    })

    // Update invoice to mark as sent (you might want to add a sentAt field to schema)
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { 
        status: invoice.status === 'draft' ? 'unpaid' : invoice.status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Invoice sent successfully"
    })

  } catch (error) {
    console.error("Send invoice error:", error)
    return NextResponse.json(
      { error: "Failed to send invoice" },
      { status: 500 }
    )
  }
} 