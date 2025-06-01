import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { 
  FileText, 
  Zap, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  Clock,
  Users,
  DollarSign,
  BarChart,
  Mail,
  Download,
  Palette
} from "lucide-react"

export default function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Hero Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 mb-8">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Trusted by 10,000+ freelancers worldwide
            </div>
            
            {/* Main Hero Text */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-black mb-6 leading-tight">
              Invoice
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 bg-clip-text text-transparent">
                Brilliantly
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              The most elegant invoicing platform for modern professionals. 
              Create, send, and get paid faster than ever before.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-gray-200 hover:border-black text-black px-8 py-4 text-lg rounded-full transition-all duration-300"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Hero Image/Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">Invoice #001</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-24"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-lg font-bold">Total: $2,500</div>
                      <Button size="sm" className="bg-black text-white">Pay Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black mb-2">10K+</div>
              <div className="text-gray-300">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">$2M+</div>
              <div className="text-gray-300">Invoices Sent</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your invoicing workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: FileText,
                title: "Professional Invoices",
                description: "Create stunning, professional invoices that reflect your brand and get you paid faster."
              },
              {
                icon: Zap,
                title: "Instant Payments",
                description: "Accept payments instantly with Stripe integration. Your clients can pay with one click."
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Bank-level security with 99.9% uptime. Your data and payments are always protected."
              },
              {
                icon: TrendingUp,
                title: "Growth Analytics",
                description: "Track your revenue, monitor payment trends, and grow your business with insights."
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Send invoices worldwide with multi-currency support and localized templates."
              },
              {
                icon: Clock,
                title: "Time Saving",
                description: "Automate recurring invoices and reminders. Focus on your work, not paperwork."
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Features */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-black mb-6">
                Built for Modern Professionals
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Smart Email Integration",
                    description: "Send invoices directly from the platform with automatic follow-ups and payment reminders."
                  },
                  {
                    icon: Download,
                    title: "PDF Export",
                    description: "Generate beautiful PDF invoices instantly. Perfect for offline sharing and record keeping."
                  },
                  {
                    icon: Palette,
                    title: "Custom Branding",
                    description: "Add your logo, colors, and branding to create invoices that reflect your business."
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-black mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500">INVOICE</div>
                    <div className="text-sm text-gray-500">#INV-001</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-black rounded w-40"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <div className="h-3 bg-gray-100 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-20"></div>
                    </div>
                    <div>
                      <div className="h-3 bg-gray-100 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-100 rounded w-32"></div>
                      <div className="h-3 bg-gray-100 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-100 rounded w-28"></div>
                      <div className="h-3 bg-gray-100 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <div className="text-lg font-bold">Total: $1,250</div>
                    <Button size="sm" className="bg-black text-white">Pay Invoice</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              Loved by Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about Invoicely
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Freelance Designer",
                avatar: "SC",
                content: "Invoicely transformed how I handle payments. I get paid 3x faster now and the invoices look incredibly professional."
              },
              {
                name: "Marcus Rodriguez",
                role: "Consultant",
                avatar: "MR",
                content: "The simplicity is amazing. I can create and send an invoice in under 2 minutes. My clients love the easy payment process."
              },
              {
                name: "Emily Watson",
                role: "Developer",
                avatar: "EW",
                content: "Finally, an invoicing tool that doesn't overcomplicate things. Clean, fast, and reliable. Exactly what I needed."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 bg-gray-50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-black">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, scale when you're ready. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* Free Plan */}
            <Card className="relative overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10">
                <div>
                  <h3 className="text-2xl font-bold text-black mb-2">Free</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-black text-black">$0</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                  
                  <Link href="/register">
                    <Button 
                      variant="outline" 
                      className="w-full mb-8 py-3 text-base font-medium border-2 border-gray-200 hover:border-black text-black rounded-xl transition-all duration-300"
                    >
                      Get started →
                    </Button>
                  </Link>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-500 mb-4">Includes:</p>
                    <ul className="space-y-3">
                      {[
                        "1 invoice per month",
                        "Professional templates",
                        "Online payments",
                        "Email support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative overflow-hidden bg-black text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-6 right-6 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <CardContent className="p-10">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-black text-white">$5</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                  
                  <Link href="/register">
                    <Button 
                      className="w-full mb-8 py-3 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300"
                    >
                      Get started →
                    </Button>
                  </Link>

                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-400 mb-4">Includes:</p>
                    <ul className="space-y-3">
                      {[
                        "Unlimited invoices",
                        "Premium templates",
                        "Online payments",
                        "Priority support",
                        "Custom branding",
                        "Advanced analytics"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/pricing">
              <Button variant="outline" className="border-2 border-gray-200 hover:border-black text-black px-8 py-3 rounded-xl transition-all duration-300">
                View Full Pricing Details
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
            Ready to Get Paid Faster?
          </h2>
          
          {/* CTA Button */}
          <Link href="/register">
            <Button 
              size="lg" 
              className="group relative bg-white hover:bg-gray-50 text-black px-8 py-4 text-lg font-medium rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Start Your Free Account
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              
              {/* Glossy button effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </Link>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-white/15 rounded-full animate-ping"></div>
      </section>
    </MarketingLayout>
  )
}
