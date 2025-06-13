"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Sparkles,
  FileText,
  Zap,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchemaType } from "@/schemas/auth";

export default function RegisterPage() {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  // Show loading while checking auth status
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render register form if user is authenticated
  if (session) {
    return null;
  }

  const handleSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log(data);

    try {
      const { data: signUpData, error: authError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (authError) {
        toast.error(authError.message || "Registration failed");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
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
                Create your account
              </h2>
              <p className="text-muted-foreground">
                Start invoicing your clients today
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...form.register("name")}
                    required
                    className="pl-10 h-10 border-border focus:border-foreground focus:ring-foreground rounded-md"
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

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
                    placeholder="Create a strong password"
                    {...form.register("password")}
                    required
                    minLength={6}
                    className="pl-10 h-10 border-border focus:border-foreground focus:ring-foreground rounded-md"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium h-10 rounded-md transition-all duration-300 group"
              >
                <span className="flex items-center justify-center">
                  {form.formState.isSubmitting
                    ? "Creating account..."
                    : "Create account"}
                  {!form.formState.isSubmitting && (
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </span>
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-foreground font-medium hover:text-muted-foreground transition-colors underline underline-offset-2"
                >
                  Sign in here
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
                <Sparkles className="w-10 h-10 text-background" />
              </div>
              <h3 className="text-3xl font-bold text-background">
                Start Invoicing Today
              </h3>
              <p className="text-secondary text-lg leading-relaxed">
                Join thousands of professionals who trust Invoicely to manage
                their invoicing and get paid faster.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                {
                  icon: FileText,
                  title: "Professional Templates",
                  description: "Beautiful invoice designs that impress clients",
                },
                {
                  icon: Zap,
                  title: "One-Click Payments",
                  description: "Clients can pay instantly with secure payments",
                },
                {
                  icon: Clock,
                  title: "Save Hours Weekly",
                  description: "Automate invoicing and focus on your work",
                },
                {
                  icon: TrendingUp,
                  title: "Grow Your Business",
                  description:
                    "Track revenue and get insights into your performance",
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
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-background">$2M+</div>
                <div className="text-secondary text-sm">
                  Total invoices processed by our users
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
