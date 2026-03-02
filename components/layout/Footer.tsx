import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7">
            <Image src="/bot-logo.png" alt="SynthX" fill className="object-contain rounded-md" />
          </div>
          <span className="font-display font-bold text-sm gradient-text">SynthX</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
          <Link href="/docs" className="hover:text-gray-300 transition-colors">Docs</Link>
          <Link href="/support" className="hover:text-gray-300 transition-colors">Support</Link>
          <a href="https://discord.gg/WKX5HHPmWz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Discord</a>
        </div>
        <p className="text-xs text-gray-700">© {new Date().getFullYear()} SynthX. All rights reserved.</p>
      </div>
    </footer>
  );
}
