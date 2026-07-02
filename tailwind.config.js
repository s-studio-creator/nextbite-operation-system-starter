/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        tomato: {
          600: "#E73D2F",
          700: "#C92F24"
        },
        bite: {
          yellow: "#F2B84B",
          green: "#41A765",
          background: "#FFF8F1",
          surface: "#FFFFFF",
          card: "#FFFDF9",
          ink: "#201A17",
          muted: "#6E625D",
          border: "#D9D0C8",
          error: "#D93838"
        }
      },
      borderRadius: {
        bite: "24px",
        card: "28px",
        sheet: "32px"
      },
      spacing: {
        18: "4.5rem"
      },
      boxShadow: {
        card: "0 8px 24px rgba(32, 26, 23, 0.1)",
        floating: "0 12px 32px rgba(32, 26, 23, 0.16)"
      }
    }
  },
  plugins: []
};
