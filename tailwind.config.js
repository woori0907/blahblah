/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('/login.jpg')",
      },
    },
    fontFamily: {
      logo: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};
