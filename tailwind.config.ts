import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neonYellow: "#FFFF00",
        neonYellowDark: "#CCCC00",
      },
      keyframes: {
        bounceUpDown: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-1px)" },
        },
        bounceUpDownExtreme: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        bounce1: "bounceUpDown 1s infinite ease-in-out",
        bounce2: "bounceUpDown 1.2s infinite ease-in-out",
        bounce3: "bounceUpDown 1.4s infinite ease-in-out",
        bounce4: "bounceUpDown 1.6s infinite ease-in-out",
        bounce5: "bounceUpDown 1.8s infinite ease-in-out",
        bounce6: "bounceUpDown 2s infinite ease-in-out",
        bounce7: "bounceUpDown 2.2s infinite ease-in-out",
        bounceExtreme: "bounceUpDownExtreme 4s infinite ease-in-out",
      },
      fontFamily: {
        sans: [
          "Calibri",
          "Candara",
          "Segoe",
          "Segoe UI",
          "Optima",
          "Arial",
          "sans-serif",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily:
              "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
