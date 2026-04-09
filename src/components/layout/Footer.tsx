import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-400 text-xl">⛏</span>
            <span className="text-white font-bold text-lg">HashVault</span>
          </div>
          <p className="text-gray-500 text-sm">Professional Bitcoin cloud mining platform with guaranteed uptime and transparent payouts.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/plans" className="hover:text-amber-400">Mining Plans</Link></li>
            <li><Link href="/dashboard" className="hover:text-amber-400">Dashboard</Link></li>
            <li><Link href="/auth/register" className="hover:text-amber-400">Get Started</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/about" className="hover:text-amber-400">About Us</Link></li>
            <li><Link href="/faq" className="hover:text-amber-400">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-amber-400">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Trust & Security</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-2">🔒 SSL Secured</span>
            <span className="flex items-center gap-2">✅ Verified Payouts</span>
            <span className="flex items-center gap-2">⚡ 99.9% Uptime</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} HashVault. All rights reserved. · <a href="mailto:hashvaultsupport@gmail.com" className="hover:text-amber-400">hashvaultsupport@gmail.com</a>
      </div>
    </footer>
  );
}
