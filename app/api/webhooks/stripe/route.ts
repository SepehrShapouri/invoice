import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

// Disable body parsing for this route
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event
  let body: string

  try {
    // Read the raw body properly for Stripe signature verification
    const chunks = []
    const reader = request.body?.getReader()
    
    if (!reader) {
      return NextResponse.json({ error: "No request body" }, { status: 400 })
    }

    let done = false
    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) {
        chunks.push(value)
      }
    }

    const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)))
    body = buffer.toString()

    // Verify webhook signature with the raw body
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log(`Received webhook: ${event.type}`)

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        console.log(`Checkout session completed: ${session.id}`)
        console.log(`Session metadata:`, session.metadata)
        
        // Handle subscription checkout completion
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const customerId = session.customer as string
          
          // Find user by customer ID
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId }
          })
          
          if (user && subscription) {
            // Determine plan based on price ID
            const priceId = subscription.items.data[0]?.price.id
            let plan = 'monthly' // default
            if (priceId === process.env.STRIPE_ANNUAL_PRICE_ID) {
              plan = 'annual'
            }
            
            await prisma.user.update({
              where: { id: user.id },
              data: {
                stripeSubscriptionId: subscription.id,
                plan,
                subscriptionStatus: subscription.status,
                subscriptionCurrentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
                subscriptionCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
                stripePriceId: priceId,
              }
            })
            
            console.log(`User ${user.id} subscription activated: ${subscription.id}`)
          }
        }
        // Handle invoice payment completion
        else if (session.metadata?.invoice_id) {
          // Mark invoice as paid
          const updatedInvoice = await prisma.invoice.update({
            where: { id: session.metadata.invoice_id },
            data: {
              status: 'paid',
              paidAt: new Date(),
              stripePaymentIntentId: session.payment_intent as string,
            }
          })
          
          console.log(`Invoice ${session.metadata.invoice_id} marked as paid - Status: ${updatedInvoice.status}`)
        } else {
          console.log("No invoice_id in session metadata")
        }
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object
        console.log(`Subscription updated: ${updatedSubscription.id}`)
        
        const subUser = await prisma.user.findFirst({
          where: { stripeSubscriptionId: updatedSubscription.id }
        })
        
        if (subUser) {
          await prisma.user.update({
            where: { id: subUser.id },
            data: {
              subscriptionStatus: updatedSubscription.status,
              subscriptionCurrentPeriodStart: new Date(updatedSubscription.items.data[0].current_period_start * 1000),
              subscriptionCurrentPeriodEnd: new Date(updatedSubscription.items.data[0].current_period_end * 1000),
              subscriptionCancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
            }
          })
          
          console.log(`User ${subUser.id} subscription updated: ${updatedSubscription.status}`)
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        console.log(`Subscription canceled: ${deletedSubscription.id}`)
        
        const canceledUser = await prisma.user.findFirst({
          where: { stripeSubscriptionId: deletedSubscription.id }
        })
        
        if (canceledUser) {
          await prisma.user.update({
            where: { id: canceledUser.id },
            data: {
              plan: 'free',
              subscriptionStatus: 'canceled',
              stripeSubscriptionId: null,
              stripePriceId: null,
            }
          })
          
          console.log(`User ${canceledUser.id} subscription canceled, reverted to free plan`)
        }
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log(`Payment intent succeeded: ${paymentIntent.id}`)
        
        // Try to find invoice by payment intent ID and mark as paid
        if (paymentIntent.metadata?.invoice_id) {
          await prisma.invoice.update({
            where: { id: paymentIntent.metadata.invoice_id },
            data: {
              status: 'paid',
              paidAt: new Date(),
              stripePaymentIntentId: paymentIntent.id,
            }
          })
          
          console.log(`Invoice ${paymentIntent.metadata.invoice_id} marked as paid via payment_intent`)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
} 