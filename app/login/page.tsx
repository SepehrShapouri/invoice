"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Mail,
  Lock,
  FileText,
  Zap,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

export default function LoginPage() {
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isPending && session) {
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    }
  }, [session, isPending, router, searchParams]);

  // Show loading while checking auth status
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render login form if user is authenticated
  if (session) {
    return null;
  }

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log(data);

    try {
      const { data: signInData, error: authError } = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        toast.error(authError.message || "Login failed");
      } else {
        const from = searchParams.get("from") || "/dashboard";
        router.push(from);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        {/* Logo/Brand - Top Left */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-black mb-1">
              <span className="bg-gradient-to-r from-foreground via-muted-foreground to-muted bg-clip-text text-transparent">
                Invoicely
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Professional invoicing platform
            </p>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Auth Form */}
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Welcome back
              </h2>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>

            {/* Form */}
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...form.register("email")}
                    required
                    className="pl-10 h-10 border-border focus:border-foreground focus:ring-foreground rounded-md"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...form.register("password")}
                    required
                    className="pl-10 h-10 border-border focus:border-foreground focus:ring-foreground rounded-md"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium h-10 rounded-md transition-all duration-300 group"
              >
                <span className="flex items-center justify-center">
                  {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                  {!form.formState.isSubmitting && (
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </span>
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-foreground font-medium hover:text-muted-foreground transition-colors underline underline-offset-2"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                ← Back to Invoicely
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Features Showcase */}
      <div className="hidden lg:flex flex-1 bg-foreground relative overflow-hidden">
        {/* Glossy background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-muted-foreground to-foreground"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/5 to-transparent"></div>

        <div className="relative flex items-center justify-center min-h-screen w-full p-12">
          <div className="max-w-md w-full space-y-8">
            {/* Main Feature */}
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-background/10 rounded-md flex items-center justify-center mx-auto backdrop-blur-sm">
                <FileText className="w-10 h-10 text-background" />
              </div>
              <h3 className="text-3xl font-bold text-background">
                Professional Invoicing
              </h3>
              <p className="text-secondary text-lg leading-relaxed">
                Create stunning invoices that get you paid faster. Modern design
                meets powerful functionality.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                {
                  icon: Zap,
                  title: "Instant Payments",
                  description: "Get paid immediately with one-click payments",
                },
                {
                  icon: Shield,
                  title: "Bank-Level Security",
                  description:
                    "Your data is protected with enterprise security",
                },
                {
                  icon: FileText,
                  title: "Professional Templates",
                  description: "Beautiful designs that reflect your brand",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-background/10 rounded-md flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <feature.icon className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-background mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-secondary text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicator */}
            <div className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-md p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-background font-medium">
                  Trusted by 10,000+ professionals
                </span>
              </div>
              <p className="text-secondary text-sm">
                Join thousands of freelancers and businesses who trust Invoicely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
