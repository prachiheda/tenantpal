import Link from "next/link"
import { Home, Mail, Phone, Instagram, Twitter, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-emerald-500 p-1">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">TenantPal</span>
            </div>
            <p className="text-sm text-gray-600">
              Empowering tenants with AI-powered legal assistance to understand and defend their rights.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-emerald-500">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-emerald-500">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-emerald-500">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                  Tenant Rights Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                  Legal Dictionary
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>support@tenantpal.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>(555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} TenantPal. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-emerald-500">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
