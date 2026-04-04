import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-6xl mb-4">⛏</div>
        <h1 className="text-6xl font-bold text-amber-400 mb-4">404</h1>
        <p className="text-gray-400 text-lg mb-8">This block doesn&apos;t exist on the chain.</p>
        <Link href="/" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
