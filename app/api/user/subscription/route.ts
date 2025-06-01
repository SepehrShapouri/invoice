import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

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

    // Fetch user with subscription data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        plan: true,
        subscriptionStatus: true,
        subscriptionCurrentPeriodStart: true,
        subscriptionCurrentPeriodEnd: true,
        subscriptionCancelAtPeriodEnd: true,
        invoicesSentThisMonth: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: {
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionCurrentPeriodStart: user.subscriptionCurrentPeriodStart,
        subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
        subscriptionCancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd,
        invoicesSentThisMonth: user.invoicesSentThisMonth,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        stripePriceId: user.stripePriceId,
      }
    })

  } catch (error) {
    console.error("Fetch user subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 