/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        dark: {
          50: "var(--text-primary)",   // Dynamic text color
          100: "var(--text-muted)",    // Dynamic muted text
          800: "var(--card-bg-solid)", // Solid card bg (like dropdowns)
          900: "var(--bg-main)",       // Main background
          950: "var(--bg-sidebar)",    // Sidebar/Navbar background
        },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        coin: "#fbbf24",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};