const testimonials = [
  { name: "James K.", country: "🇺🇸 USA", text: "Been mining with HashVault for 6 months. Consistent daily payouts and great support.", plan: "Pro Plan" },
  { name: "Amara O.", country: "🇳🇬 Nigeria", text: "The referral program alone has earned me an extra $800 this month. Highly recommend.", plan: "Starter Plan" },
  { name: "Chen W.", country: "🇨🇳 China", text: "Enterprise plan gives incredible ROI. The dashboard is clean and easy to use.", plan: "Enterprise Plan" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">What Our Miners Say</h2>
        <p className="text-gray-400">Trusted by thousands of miners worldwide</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-1 text-amber-400 mb-3">{"★★★★★"}</div>
            <p className="text-gray-300 text-sm mb-4">"{t.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.country}</div>
              </div>
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">{t.plan}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
