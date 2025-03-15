/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        dark: "#38404A",
        light: "#F6F6F6",
      },
      transitionTimingFunction: {
        "cubic-ease": "cubic-bezier(.77,0,.175,1)",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
