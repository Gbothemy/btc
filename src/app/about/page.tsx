import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-white mb-6">About HashVault</h1>
        <p className="text-gray-400 text-lg mb-8">
          HashVault is a professional Bitcoin cloud mining platform founded in 2020. We operate mining farms across North America, Europe, and Asia, providing retail investors access to institutional-grade mining infrastructure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { title: "Our Mission", desc: "To democratize Bitcoin mining by making it accessible to everyone, regardless of technical knowledge or capital." },
            { title: "Our Infrastructure", desc: "We operate over 50,000 ASIC miners across 6 data centers with redundant power and cooling systems." },
            { title: "Transparency", desc: "All payouts are verifiable on-chain. We publish monthly reports on hashrate, earnings, and operational costs." },
            { title: "Security", desc: "Bank-grade encryption, 2FA, and cold storage for all platform funds. Your assets are always protected." },
          ].map((item) => (
            <div key={item.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
