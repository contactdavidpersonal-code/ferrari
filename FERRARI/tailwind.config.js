import tailwindcssAnimate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  theme: {
    extend: {
      colors: {
        // eXp Realty Brand Palette
        primary: {
          DEFAULT: '#000000',
          light: '#1a1a1a',
          dark: '#333333',
        },
        accent: {
          DEFAULT: '#6B4E0F', // very dark gold/bronze for maximum visibility
          light: '#8B6914', // medium-dark gold
          dark: '#4A3509', // darkest gold/bronze
        },
        // Legacy support - will be migrated
        cabernet: {
          DEFAULT: '#000000',
          light: '#1a1a1a',
          dark: '#333333',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4D03F',
          dark: '#B8860B',
        },
        // Neutral colors
        charcoal: '#333333',
        'charcoal-light': '#555555',
        'charcoal-lighter': '#777777',
        cream: '#F7F1EB',
        'cream-light': '#FDF9F5',
        'cream-dark': '#F0E8E0',
        // shadcn/ui default colors
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(214.3 31.8% 91.4%)",
        ring: "hsl(221.2 83.2% 53.3%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        secondary: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(222.2 47.4% 11.2%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)",
        },
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(215.4 16.3% 46.9%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        script: ['Great Vibes', 'cursive'],
        cursive: ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

