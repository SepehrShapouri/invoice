import Link from "next/link"
import { 
  Mail, 
  Twitter, 
  Linkedin, 
  Github,
  FileText,
  CreditCard,
  Shield,
  BarChart,
  Clock,
  Users
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/#features", label: "Features" },
    { href: "/register", label: "Start Free" }
  ]

  const companyLinks = [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" }
  ]

  const supportLinks = [
    { href: "/help", label: "Help Center" },
    { href: "/docs", label: "Documentation" },
    { href: "/status", label: "System Status" },
    { href: "/contact", label: "Support" }
  ]

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/security", label: "Security" },
    { href: "/cookies", label: "Cookie Policy" }
  ]

  const features = [
    { icon: FileText, label: "Professional Invoices" },
    { icon: CreditCard, label: "Instant Payments" },
    { icon: Shield, label: "Bank-Level Security" },
    { icon: BarChart, label: "Advanced Analytics" },
    { icon: Clock, label: "Time Tracking" },
    { icon: Users, label: "Client Management" }
  ]

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-2xl font-bold text-black">Invoicely</span>
            </Link>
            
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              The most elegant invoicing platform for modern professionals. 
              Create, send, and get paid faster than ever before.
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <feature.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="https://linkedin.com" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="https://github.com" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200">
                <Github className="w-4 h-4" />
              </Link>
              <Link href="mailto:hello@invoicely.com" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200">
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-gray-600">
                © {currentYear} Invoicely. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4 text-xs text-gray-500">
                <span>Built with Next.js</span>
                <span>•</span>
                <span>Powered by Stripe</span>
                <span>•</span>
                <span>Secured by Better Auth</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link href="/status" className="hover:text-black transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>All systems operational</span>
                </div>
              </Link>
              <Link href="/changelog" className="hover:text-black transition-colors">
                v2.1.0
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 