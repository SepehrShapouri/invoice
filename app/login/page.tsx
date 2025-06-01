"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mail, Lock, FileText, Zap, Shield, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Redirect if already authenticated
  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard")
    }
  }, [session, isPending, router])

  // Show loading while checking auth status
  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-black">Loading...</div>
      </div>
    )
  }

  // Don't render login form if user is authenticated
  if (session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error: authError } = await signIn.email({
        email,
        password,
      })

      if (authError) {
        setError(authError.message || "Login failed")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        {/* Logo/Brand - Top Left */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-black mb-1">
              <span className="bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
                Invoicely
              </span>
            </h1>
            <p className="text-gray-600 text-sm">Professional invoicing platform</p>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Auth Form */}
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-2">Welcome back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-10 border-gray-200 focus:border-black focus:ring-black rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-10 border-gray-200 focus:border-black focus:ring-black rounded-xl"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium h-10 rounded-xl transition-all duration-300 group"
              >
                <span className="flex items-center justify-center">
                  {isLoading ? "Signing in..." : "Sign in"}
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </span>
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-black font-medium hover:text-gray-700 transition-colors underline underline-offset-2"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-black transition-colors text-sm"
              >
                ← Back to Invoicely
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Features Showcase */}
      <div className="hidden lg:flex flex-1 bg-black relative overflow-hidden">
        {/* Glossy background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative flex items-center justify-center min-h-screen w-full p-12">
          <div className="max-w-md w-full space-y-8">
            {/* Main Feature */}
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                Professional Invoicing
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Create stunning invoices that get you paid faster. Modern design meets powerful functionality.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                {
                  icon: Zap,
                  title: "Instant Payments",
                  description: "Get paid immediately with one-click payments"
                },
                {
                  icon: Shield,
                  title: "Bank-Level Security",
                  description: "Your data is protected with enterprise security"
                },
                {
                  icon: FileText,
                  title: "Professional Templates",
                  description: "Beautiful designs that reflect your brand"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicator */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Trusted by 10,000+ professionals</span>
              </div>
              <p className="text-gray-400 text-sm">
                Join thousands of freelancers and businesses who trust Invoicely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 