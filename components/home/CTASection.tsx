import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-gray-500 mb-8">Add SynthX to your server and take full control from the dashboard.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`}
            target="_blank" rel="noopener noreferrer"
            className="btn-primary text-base px-6 py-3"
          >
            Invite SynthX
          </a>
          <Link href="/dashboard" className="btn-secondary text-base px-6 py-3">
            Open Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
