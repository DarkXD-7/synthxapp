import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, Search } from "lucide-react";
import DocsContent from "@/components/docs/DocsContent";

export default function DocsPage() {
  return (
    <main className="min-h-screen animated-bg">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
              <BookOpen size={14} />
              Command Documentation
            </div>
            <h1 className="text-5xl font-black mb-4">
              All <span className="gradient-text">Commands</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Complete documentation for all 120+ SynthX commands, grouped by module.
            </p>
          </div>
          <DocsContent />
        </div>
      </div>
      <Footer />
    </main>
  );
}
