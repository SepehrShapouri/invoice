import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import {
  ArrowRight,
  Send,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Clock,
  BarChart,
  Globe,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6">
            How
            <br />
            <span className="bg-gradient-to-r from-foreground via-muted-foreground to-muted bg-clip-text text-transparent">
              Invoicely Works
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Create professional invoices, get paid faster, and grow your
            business. It's that simple.
          </p>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-xl mr-4">
                  1
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Create Your Invoice
                </h2>
              </div>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                Start by filling in your client's details and adding line items
                for your work. Our intuitive interface makes it quick and easy.
              </p>
              <ul className="space-y-3">
                {[
                  "Professional invoice templates",
                  "Automatic calculations",
                  "Custom line items",
                  "Tax and discount options",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md p-8">
              <div className="bg-card rounded-md p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">New Invoice</h3>
                  <span className="text-sm text-muted-foreground">
                    #INV-001
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Client
                    </div>
                    <div className="h-3 bg-foreground rounded-md w-32"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Date
                      </div>
                      <div className="h-3 bg-muted rounded-md w-20"></div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Due
                      </div>
                      <div className="h-3 bg-muted rounded-md w-20"></div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <div className="h-3 bg-muted rounded-md w-32"></div>
                      <div className="h-3 bg-muted rounded-md w-16"></div>
                    </div>
                    <div className="flex justify-between mb-2">
                      <div className="h-3 bg-muted rounded-md w-28"></div>
                      <div className="h-3 bg-muted rounded-md w-16"></div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between items-center">
                    <div className="font-bold text-foreground">
                      Total: $1,250
                    </div>
                    <Button size="sm" className="bg-foreground text-background">
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 md:order-1 rounded-md p-8">
              <div className="bg-card rounded-md p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Send Invoice</h3>
                  <Send className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">To</div>
                    <div className="h-3 bg-foreground rounded-md w-40"></div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Subject
                    </div>
                    <div className="h-3 bg-muted rounded-md w-full"></div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Message
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded-md w-full"></div>
                      <div className="h-3 bg-muted rounded-md w-3/4"></div>
                      <div className="h-3 bg-muted rounded-md w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      Invoice attached
                    </div>
                    <Button size="sm" className="bg-foreground text-background">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-xl mr-4">
                  2
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Send to Your Client
                </h2>
              </div>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                Send your invoice directly to your client with just one click.
                We'll handle the email delivery and tracking for you.
              </p>
              <ul className="space-y-3">
                {[
                  "One-click email sending",
                  "Professional email templates",
                  "Delivery confirmation",
                  "Automatic follow-up reminders",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-xl mr-4">
                  3
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Get Paid Instantly
                </h2>
              </div>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                Your clients can pay directly from the invoice with secure
                online payments. Money goes straight to your account.
              </p>
              <ul className="space-y-3">
                {[
                  "Secure online payments",
                  "Multiple payment methods",
                  "Instant payment notifications",
                  "Automatic invoice status updates",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md p-8">
              <div className="bg-card rounded-md p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Invoice Payment</h3>
                  <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-background" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Due</span>
                    <span className="font-bold text-foreground">$1,250.00</span>
                  </div>
                  <div className="border border-border rounded-md p-4 bg-muted">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Pay with
                      </span>
                    </div>
                    <div className="h-3 bg-muted-foreground/20 rounded-md w-full mb-2"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded-md w-1/2"></div>
                  </div>
                  <Button className="w-full bg-foreground text-background">
                    Pay $1,250.00
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Why Choose Invoicely?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for modern professionals who value simplicity and efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Create and send invoices in under 2 minutes. No complex setup or learning curve required.",
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description:
                  "Your data and payments are protected with enterprise-grade security and encryption.",
              },
              {
                icon: Clock,
                title: "Save Time",
                description:
                  "Automate recurring invoices, reminders, and follow-ups. Focus on your work, not paperwork.",
              },
              {
                icon: BarChart,
                title: "Track Everything",
                description:
                  "Monitor payment status, track revenue trends, and get insights into your business performance.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description:
                  "Send invoices worldwide with multi-currency support and localized payment methods.",
              },
              {
                icon: Users,
                title: "Client-Friendly",
                description:
                  "Beautiful, professional invoices that make it easy for clients to understand and pay.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 bg-card hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-foreground rounded-md flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-background" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              From Setup to Payment in Minutes
            </h2>
            <p className="text-xl text-muted-foreground">
              See how quickly you can get started with Invoicely
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                time: "30 seconds",
                title: "Sign Up",
                description:
                  "Create your free account with just your email address. No credit card required.",
              },
              {
                time: "1 minute",
                title: "Add Client Details",
                description:
                  "Enter your client's information and your business details. We'll save it for next time.",
              },
              {
                time: "2 minutes",
                title: "Create Invoice",
                description:
                  "Add line items, set your rates, and customize the invoice with your branding.",
              },
              {
                time: "10 seconds",
                title: "Send Invoice",
                description:
                  "One click to send your professional invoice directly to your client's inbox.",
              },
              {
                time: "Instant",
                title: "Get Paid",
                description:
                  "Your client receives the invoice and can pay immediately with secure online payments.",
              },
            ].map((step, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-foreground rounded-md flex items-center justify-center">
                    <span className="text-background font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-foreground mr-3">
                      {step.title}
                    </h3>
                    <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-md">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-foreground">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-muted-foreground to-foreground opacity-90"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-background mb-8 leading-tight">
            Ready to Start?
          </h2>

          <Link href="/register">
            <Button
              size="lg"
              className="group relative bg-background hover:bg-muted text-foreground px-8 py-4 text-lg font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>

              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-background/20 via-transparent to-background/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </Link>
        </div>

        {/* Floating particles effect */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-background/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-background/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-background/25 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-background/15 rounded-full animate-ping"></div>
      </section>
    </MarketingLayout>
  );
}
