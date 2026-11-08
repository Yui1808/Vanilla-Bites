/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vanilla: {
          cream: "#FFF8ED",
          ivory: "#F8EBD8",
          caramel: "#C58B52",
          "caramel-dark": "#A86F37",
          chocolate: "#432719",
          "chocolate-light": "#5D3724",
          espresso: "#251710",
          "espresso-deep": "#190F0A",
          peach: "#F4C9A4",
          "peach-light": "#FDECE0",
          gold: "#D4A373",
        },
      },
      fontFamily: {
        serif: ["'Fraunces'", "Playfair Display", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft-glow': '0 20px 40px -15px rgba(197, 139, 82, 0.15)',
        'luxury': '0 25px 50px -12px rgba(37, 23, 16, 0.12)',
        'float': '0 30px 60px -20px rgba(67, 39, 25, 0.22)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'vanilla-mesh': 'radial-gradient(at 0% 0%, #FFF8ED 0, transparent 50%), radial-gradient(at 100% 100%, #F4C9A4 0, transparent 40%), radial-gradient(at 50% 50%, #F8EBD8 0, transparent 60%)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatRev 7s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
      },
    },
  },
  plugins: [],
};
