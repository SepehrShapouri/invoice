import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Get invoice and user info
    const invoice = await prisma.invoice.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            stripeAccountId: true,
            stripeAccountStatus: true,
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    if (invoice.status === 'paid') {
      return NextResponse.json({ error: "Invoice is already paid" }, { status: 400 })
    }

    if (!invoice.user.stripeAccountId) {
      return NextResponse.json({ 
        error: "Payment not available - merchant hasn't connected their payment account" 
      }, { status: 400 })
    }

    if (invoice.user.stripeAccountStatus !== 'active') {
      return NextResponse.json({ 
        error: "Payment not available - merchant's payment account is not active" 
      }, { status: 400 })
    }

    // Create success and cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/invoice/${slug}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/invoice/${slug}`

    // Create checkout session with Connect
    const session = await createCheckoutSession(
      invoice.id,
      invoice.total,
      invoice.currency,
      invoice.user.stripeAccountId,
      successUrl,
      cancelUrl,
      invoice.clientEmail,
      `Invoice #${invoice.slug} from ${invoice.user.name || invoice.user.email}`
    )

    // Save session ID to invoice
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        stripeCheckoutSessionId: session.id,
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error("Payment session error:", error)
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    )
  }
} 