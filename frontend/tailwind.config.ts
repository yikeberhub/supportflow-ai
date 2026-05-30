import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        customer: {
          bg: '#F5F3EE',
          surface: '#FFFFFF',
          border: '#DDD9D0',
          text: '#1A1916',
          muted: '#7A7669',
          accent: '#1A6B4A',
        },
        admin: {
          bg: '#111210',
          surface: '#1C1D1A',
          surface2: '#232520',
          border: '#323430',
          text: '#E8E5DE',
          muted: '#7A7B74',
          accent: '#3EB87A',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
