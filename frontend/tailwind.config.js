/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B0F1A",
        panel: "#12182B",
        panel2: "#1A2138",
        edge: "#2A3352",
        violet: "#7C5CFC",
        cyan: "#34E7E4",
        ember: "#FF6B6B",
        ink: "#E8ECF6",
        mute: "#8892B0",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 92, 252, 0.25)",
        "glow-cyan": "0 0 30px rgba(52, 231, 228, 0.2)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(124,92,252,0.12), transparent 60%)",
      },
    },
  },
  plugins: [],
};
