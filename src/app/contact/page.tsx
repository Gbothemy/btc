"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Message sent! We'll respond within 24 hours.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Contact Us</h1>
        <p className="text-gray-400 text-center mb-12">Our support team is available 24/7</p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm text-gray-400 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  required
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>Send Message</Button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icon: "📧", label: "Email", value: "hashvaultsupport@gmail.com" },
            { icon: "💬", label: "Live Chat", value: "Available 24/7" },
            { icon: "🌐", label: "Website", value: "www.hashvault.site" },
          ].map((c) => (
            <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl mb-2">{c.icon}</div>
              <p className="text-gray-500 text-xs">{c.label}</p>
              <p className="text-white text-sm font-medium">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
