import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAccountStatus } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !user.stripeAccountId) {
      return NextResponse.json({ error: "No Stripe account found" }, { status: 404 })
    }

    // Get fresh status from Stripe
    const accountStatus = await getAccountStatus(user.stripeAccountId)

    // Determine status based on Stripe account state
    let status = 'pending'
    if (accountStatus.charges_enabled && accountStatus.payouts_enabled) {
      status = 'active'
    } else if (accountStatus.requirements?.currently_due?.length > 0) {
      status = 'pending'
    }

    // Update user status in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeAccountStatus: status,
        // Clear onboarding URL if account is active
        stripeOnboardingUrl: status === 'active' ? null : user.stripeOnboardingUrl,
      }
    })

    return NextResponse.json({
      accountId: user.stripeAccountId,
      status,
      details: {
        charges_enabled: accountStatus.charges_enabled,
        payouts_enabled: accountStatus.payouts_enabled,
        details_submitted: accountStatus.details_submitted,
        requirements: accountStatus.requirements,
      }
    })

  } catch (error) {
    console.error("Stripe status check error:", error)
    return NextResponse.json(
      { error: "Failed to check Stripe account status" },
      { status: 500 }
    )
  }
} 