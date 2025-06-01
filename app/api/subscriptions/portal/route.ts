import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCustomerPortalSession } from "@/lib/stripe"

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

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ 
        error: "No subscription found" 
      }, { status: 400 })
    }

    // Create customer portal session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const returnUrl = `${baseUrl}/dashboard/settings`

    const portalSession = await createCustomerPortalSession(
      user.stripeCustomerId,
      returnUrl
    )

    return NextResponse.json({
      url: portalSession.url
    })

  } catch (error) {
    console.error("Customer portal error:", error)
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    )
  }
}
