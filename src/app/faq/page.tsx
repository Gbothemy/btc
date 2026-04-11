import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const faqs = [
  { q: "How does cloud mining work?", a: "You purchase a mining contract and we allocate dedicated hashrate from our physical mining farms to your account. Earnings are calculated daily based on your hashrate and the current BTC price." },
  { q: "When do I receive my earnings?", a: "Earnings are credited to your account balance every 24 hours. You can withdraw once your balance reaches the minimum threshold of $1,000." },
  { q: "What is the minimum investment?", a: "Our Starter plan begins at $200. There is no maximum investment limit." },
  { q: "How do withdrawals work?", a: "Submit a withdrawal request with your BTC or USDT wallet address. Requests are processed within 24-48 hours by our team." },
  { q: "Is my investment insured?", a: "Yes. All mining operations are insured against hardware failure and natural disasters. Your contract earnings are guaranteed for the contract duration." },
  { q: "How does the referral program work?", a: "Share your unique referral link. When someone registers and purchases a plan, you earn 5% of their plan value as a commission, credited instantly to your balance." },
];

export default function FaqPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">FAQ</h1>
        <p className="text-gray-400 text-center mb-12">Everything you need to know about HashVault</p>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
