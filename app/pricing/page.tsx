import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { 
  CheckCircle, 
  ArrowRight,
  FileText
} from "lucide-react"

export default function PricingPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 mb-8">
            Pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-black mb-6">
            Our Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
            Choose the perfect plan for your business. Start free, upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
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
                        "Professional invoice templates", 
                        "Online payment acceptance",
                        "Basic email support",
                        "PDF export",
                        "Client payment tracking"
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
                        "Premium invoice templates",
                        "Online payment acceptance", 
                        "Priority email support",
                        "PDF export & download",
                        "Advanced payment tracking",
                        "Custom branding & logo",
                        "Invoice analytics & insights",
                        "Automated payment reminders",
                        "Multi-currency support"
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
            Ready to Start Invoicing?
          </h2>
          
          {/* CTA Button */}
          <Link href="/register">
            <Button 
              size="lg" 
              className="group relative bg-white hover:bg-gray-50 text-black px-8 py-4 text-lg font-medium rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Start Free Today
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