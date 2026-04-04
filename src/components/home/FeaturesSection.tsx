const features = [
  { icon: "⚡", title: "Real-Time Mining", desc: "Monitor your hashrate, earnings, and worker status live with instant updates." },
  { icon: "🔒", title: "Bank-Grade Security", desc: "2FA, encrypted wallets, and SSL protection keep your assets safe." },
  { icon: "💸", title: "Daily Payouts", desc: "Earnings are credited daily directly to your account balance." },
  { icon: "👥", title: "Referral Program", desc: "Earn 5% commission on every referral. Unlimited earning potential." },
  { icon: "📊", title: "Transparent Stats", desc: "Full visibility into network hashrate, difficulty, and your earnings history." },
  { icon: "🌍", title: "Global Infrastructure", desc: "Mining farms across 3 continents ensure maximum uptime and efficiency." },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why HashVault?</h2>
          <p className="text-gray-400">Everything you need to mine Bitcoin professionally</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-amber-500/30 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
