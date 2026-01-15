/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1e40af"
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc"
        },
        text: {
          DEFAULT: "#1e293b",
          muted: "#64748b"
        }
      },
      borderRadius: {
        card: "12px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,0.05)",
        cardLg: "0 4px 12px rgba(0,0,0,0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
}
