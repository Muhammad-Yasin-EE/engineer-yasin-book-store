import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#04060b] border-t border-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-100">
                Engineer Yasin Books
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm">
              Your premium destination for engineering, academic, and general knowledge books. Download free materials or buy premium courses with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/books" className="hover:text-white transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/books?filter=free" className="hover:text-white transition-colors">
                  Free Books
                </Link>
              </li>
              <li>
                <Link href="/books?filter=premium" className="hover:text-white transition-colors">
                  Premium Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Payment Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We verify manual transactions (JazzCash, EasyPaisa, NayaPay, SadaPay, and ABL Bank) within 1-12 hours. For support, please contact us at:
              <br />
              <span className="text-indigo-400 font-medium">support@engineeryasin.com</span>
            </p>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <p>&copy; {new Date().getFullYear()} Engineer Yasin Books. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
