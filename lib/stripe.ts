import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

// Subscription plan constants
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
    amount: 499, // $4.99 in cents
    interval: 'month' as const,
    name: 'Monthly Pro',
  },
  ANNUAL: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID || 'price_annual_placeholder', 
    amount: 4999, // $49.99 in cents
    interval: 'year' as const,
    name: 'Annual Pro',
  }
}

// Create Stripe Connect account
export async function createStripeConnectAccount(email: string) {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    })

    return account
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    throw error
  }
}

// Create onboarding link
export async function createOnboardingLink(accountId: string, refreshUrl: string, returnUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })

    return accountLink
  } catch (error) {
    console.error('Error creating onboarding link:', error)
    throw error
  }
}

// Get account status
export async function getAccountStatus(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId)
    
    return {
      id: account.id,
      charges_enabled: account.charges_enabled,
      details_submitted: account.details_submitted,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements,
    }
  } catch (error) {
    console.error('Error retrieving account status:', error)
    throw error
  }
}

// Create payment intent for connected account
export async function createPaymentIntent(
  amount: number,
  currency: string,
  connectedAccountId: string,
  metadata?: Record<string, string>
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
      // This ensures payment goes to connected account
      transfer_data: {
        destination: connectedAccountId,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

// Create checkout session for connected account
export async function createCheckoutSession(
  invoiceId: string,
  amount: number,
  currency: string,
  connectedAccountId: string,
  successUrl: string,
  cancelUrl: string,
  clientEmail: string,
  description: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: clientEmail,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: description,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        invoice_id: invoiceId,
      },
      payment_intent_data: {
        transfer_data: {
          destination: connectedAccountId,
        },
      },
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Create subscription checkout session
export async function createSubscriptionCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
      },
    })

    return session
  } catch (error) {
    console.error('Error creating subscription checkout session:', error)
    throw error
  }
}

// Create or get Stripe customer
export async function createOrGetCustomer(userId: string, email: string, name?: string) {
  try {
    // Try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0]
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    })

    return customer
  } catch (error) {
    console.error('Error creating/getting customer:', error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    })

    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

// Create customer portal session
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
} 