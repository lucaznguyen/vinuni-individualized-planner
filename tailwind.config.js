/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vip: {
          blue: "#1A05A1",
          panel: "#E8EEF2",
          ink: "#151525",
          muted: "#5D6472",
          line: "#D4DBE3",
          green: "#2F8A4C",
          yellow: "#B7791F",
          red: "#B42318"
        }
      },
      boxShadow: {
        sheet: "0 12px 32px rgba(26, 5, 161, 0.08)"
      }
    }
  },
  plugins: []
};
