import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          400: "#c4a4fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
        violet: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        dark: {
          50: "#3d2d5c",
          100: "#2d1f47",
          200: "#211335",
          300: "#1a1028",
          400: "#120820",
          500: "#0a0a14",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #0a0a14 0%, #1a1028 50%, #0a0a14 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.08))",
        "purple-gradient": "linear-gradient(135deg, #8B5CF6, #A855F7, #C084FC)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite alternate",
        "pulse-purple": "pulsePurple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "rotate-gradient": "rotateGradient 8s ease infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" },
          "100%": { boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)" },
        },
        pulsePurple: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        rotateGradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
