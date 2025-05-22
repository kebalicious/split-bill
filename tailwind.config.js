/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#42b883',
          dark: '#42d392',
        },
        background: {
          light: '#f5f5f5',
          dark: '#1a1a1a',
        },
        card: {
          light: '#ffffff',
          dark: '#2d2d2d',
        },
        text: {
          light: '#2c3e50',
          dark: '#e0e0e0',
        }
      }
    },
  },
  plugins: [],
} 