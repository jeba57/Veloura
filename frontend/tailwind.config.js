/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF6EF",
        sand: "#F0E4D3",
        blush: "#E8C9A8",
        champagne: "#C9A063",
        caramel: "#8B5E3C",
        mocha: "#3A2A1E",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(58, 42, 30, 0.08)",
        glow: "0 0 40px rgba(201, 160, 99, 0.25)",
      },
      backgroundImage: {
        "sunlight-sweep":
          "linear-gradient(115deg, transparent 30%, rgba(255,248,240,0.35) 45%, rgba(255,248,240,0.55) 50%, rgba(255,248,240,0.35) 55%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
