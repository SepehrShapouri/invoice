"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mail, Lock, User, Sparkles, FileText, Zap, Clock, TrendingUp } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterSchemaType } from "@/schemas/auth"

export default function RegisterPage() {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  
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

  // Don't render register form if user is authenticated
  if (session) {
    return null
  }

  const handleSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log(data)

    try {
      const { data: signUpData, error: authError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (authError) {
        toast.error(authError.message || "Registration failed")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
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
              <h2 className="text-3xl font-bold text-black mb-2">Create your account</h2>
              <p className="text-gray-600">Start invoicing your clients today</p>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...form.register("name")}
                    required
                    className="pl-10 h-10 border-gray-200 focus:border-black focus:ring-black rounded-xl"
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...form.register("email")}
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
                    placeholder="Create a strong password"
                    {...form.register("password")}
                    required
                    minLength={6}
                    className="pl-10 h-10 border-gray-200 focus:border-black focus:ring-black rounded-xl"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium h-10 rounded-xl transition-all duration-300 group"
              >
                <span className="flex items-center justify-center">
                  {form.formState.isSubmitting ? "Creating account..." : "Create account"}
                  {!form.formState.isSubmitting && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </span>
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-black font-medium hover:text-gray-700 transition-colors underline underline-offset-2"
                >
                  Sign in here
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
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                Start Invoicing Today
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Join thousands of professionals who trust Invoicely to manage their invoicing and get paid faster.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                {
                  icon: FileText,
                  title: "Professional Templates",
                  description: "Beautiful invoice designs that impress clients"
                },
                {
                  icon: Zap,
                  title: "One-Click Payments",
                  description: "Clients can pay instantly with secure payments"
                },
                {
                  icon: Clock,
                  title: "Save Hours Weekly",
                  description: "Automate invoicing and focus on your work"
                },
                {
                  icon: TrendingUp,
                  title: "Grow Your Business",
                  description: "Track revenue and get insights into your performance"
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
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-white">$2M+</div>
                <div className="text-gray-300 text-sm">
                  Total invoices processed by our users
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 