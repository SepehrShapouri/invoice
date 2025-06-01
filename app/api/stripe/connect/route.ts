import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createStripeConnectAccount, createOnboardingLink } from "@/lib/stripe"

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user already has a Stripe account, return existing onboarding URL or create new one
    if (user.stripeAccountId) {
      // Check if we need to create a new onboarding link
      if (user.stripeAccountStatus !== 'active') {
        const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?stripe=refresh`
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?stripe=return`
        
        const accountLink = await createOnboardingLink(
          user.stripeAccountId,
          refreshUrl,
          returnUrl
        )

        // Update the onboarding URL
        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeOnboardingUrl: accountLink.url,
          }
        })

        return NextResponse.json({
          accountId: user.stripeAccountId,
          onboardingUrl: accountLink.url,
          status: user.stripeAccountStatus
        })
      }

      return NextResponse.json({
        accountId: user.stripeAccountId,
        status: user.stripeAccountStatus
      })
    }

    // Create new Stripe Connect account
    const account = await createStripeConnectAccount(user.email)

    // Create onboarding link
    const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?stripe=refresh`
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?stripe=return`
    
    const accountLink = await createOnboardingLink(
      account.id,
      refreshUrl,
      returnUrl
    )

    // Update user with Stripe account info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeAccountId: account.id,
        stripeAccountStatus: 'pending',
        stripeOnboardingUrl: accountLink.url,
      }
    })

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl: accountLink.url,
      status: 'pending'
    })

  } catch (error) {
    console.error("Stripe Connect error:", error)
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeAccountId: true,
        stripeAccountStatus: true,
        stripeOnboardingUrl: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      accountId: user.stripeAccountId,
      status: user.stripeAccountStatus,
      onboardingUrl: user.stripeOnboardingUrl,
      isConnected: user.stripeAccountStatus === 'active'
    })

  } catch (error) {
    console.error("Get Stripe status error:", error)
    return NextResponse.json(
      { error: "Failed to get Stripe status" },
      { status: 500 }
    )
  }
} 