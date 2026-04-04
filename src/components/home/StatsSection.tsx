const stats = [
  { icon: "⛏", label: "Total Hashrate", value: "2.4 EH/s" },
  { icon: "💰", label: "Total Payouts", value: "$4,200,000+" },
  { icon: "👥", label: "Registered Users", value: "48,291" },
  { icon: "⚡", label: "Network Uptime", value: "99.97%" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gray-900/50 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
