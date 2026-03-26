/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This tells Tailwind to scan your components!
  ],
  theme: {
    extend: {
      colors: {
        fleet: {
          bg: '#0F172A',
          card: '#1E293B',
          accent: '#10B981',
          danger: '#EF4444',
          radar: '#3B82F6',
        }
      }
    },
  },
  plugins: [],
}