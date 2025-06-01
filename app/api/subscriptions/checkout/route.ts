import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createOrGetCustomer, createSubscriptionCheckoutSession, SUBSCRIPTION_PLANS } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan } = await request.json()

    if (!plan || !['monthly', 'annual'].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't allow subscription if user already has active subscription
    if (user.subscriptionStatus === 'active' && user.plan !== 'free') {
      return NextResponse.json({ 
        error: "You already have an active subscription" 
      }, { status: 400 })
    }

    // Create or get Stripe customer
    const customer = await createOrGetCustomer(
      user.id, 
      user.email, 
      user.name
    )

    // Update user with customer ID if not set
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id }
      })
    }

    // Get the price ID for the selected plan
    const priceId = plan === 'monthly' 
      ? SUBSCRIPTION_PLANS.MONTHLY.priceId 
      : SUBSCRIPTION_PLANS.ANNUAL.priceId

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
    const successUrl = `${baseUrl}/dashboard/settings?subscription=success`
    const cancelUrl = `${baseUrl}/dashboard/settings?subscription=cancelled`

    const checkoutSession = await createSubscriptionCheckoutSession(
      customer.id,
      priceId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json({
      url: checkoutSession.url
    })

  } catch (error) {
    console.error("Subscription checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
