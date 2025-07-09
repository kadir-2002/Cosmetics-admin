import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "admin-primary": "#61bab0", 
         "admin-text-primary":"#FFFFFF",
        "admin-buttonprimary": "#61bab0", 
        "admin-dashboardprimary": "#61bab0", 
        "admin-secondary": "#61bab0", 
        "admin-tertiary": "#61bab0", 
        "admin-quaternary": "#61bab0",

      },
    },
    animation: {
      shine: "shine 1s",
      orbit: "orbit calc(var(--duration)*1s) linear infinite",
      heartbeat: "heartbeat 2s cubic-bezier(0.6, 0.10, 0.110, 0.335) infinite", // Add heartbeat animation
    },
    keyframes: {
      shine: {
        "100%": {
          left: "125%",
        },
      },
      orbit: {
        "0%": {
          transform:
            "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
        },
        "100%": {
          transform:
            "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
        },
      },
      heartbeat: {
        "0%, 100%": { transform: "scale(1)", opacity: "1" },
        "25%": { transform: "scale(1.2)", opacity: "0.9" },
        "50%": { transform: "scale(1)", opacity: "1" },
      },
    },
    keyframess: {
      bounceCustom: {
        "0%, 100%": {
          transform: "translateY(0)",
          animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
        },
        "50%": {
          transform: "translateY(-20px)",
          animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
        },
      },
    },
    animations: {
      bounceCustom: "bounceCustom 1.5s infinite",
    },
  },

  plugins: [],
} satisfies Config;
