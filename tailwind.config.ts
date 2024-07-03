import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        title: ["64px", "80px"],
        subTitle: ["22px", "22px"],
        "5xl": ["44px", "50px"],
        "4xl": ["34px", "40px"],
      },
      screens: {
        maxscreen: "1500px",
        fullscreen: "1280px",
        laptop: "1024px",
        minting: "920px",
        detail: "840px",
        tablet: "768px",
        mobile: "600px",
        se: "375px",
      },
      animation: {
        "spin-slow": "spin 10s linear infinite",
        "scroll-me": "twerk 2s ease-out infinite",
        finger: "fingerRotation 2s ease-out infinite",
        growMsg: "growOpacity 2s linear",
        questionBlink: "blink 4s linear infinite",
        drop: "drop 2s ease-out infinite",
        growWidth: "growWidth 1.2s ease-in-out infinite",
        growHeight: "growHeight 2s ease-in-out infinite",
        whatsUp: "translateY 24s linear infinite",
        whatsUpMobile: "translateY 24s linear infinite",
        fadeInUp: "fadeInUp 0.5s ease-out",
        yLoop: "yLoop 40s linear infinite",
        xLoop: "xLoop 90s linear infinite",
        xInfinite: "xInfinite 30s linear infinite",
        float: "float 2s ease-in-out infinite",
        pulseSlow: "heartBeat 1s ease-in-out infinite",
        floatWater: "floatWater 2s ease-in-out infinite",
        pointingX: "pointingX 0.7s ease-in-out infinite",
        pointingY: "pointingY 0.7s ease-in-out infinite",
        buttonFadeIn: "buttonFadeIn 0.5s ease-in-out",
      },
      keyframes: {
        xInfinite: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        xLoop: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
        yLoop: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-100%)",
          },
        },
        twerk: {
          "0%, 70%, 100%": { transform: "translateX(0)" },
          "60%": { transform: "translateX(-1.2%)" },
        },
        fingerRotation: {
          "0%, 70%, 100%": { transform: "rotate(0)" },
          "60%": { transform: "rotate(-30deg)" },
        },

        blink: {
          "45%, 80%": { opacity: "1" },
          "0% , 35% , 100%": { opacity: "0" },
        },
        growOpacity: {
          "0%": { opacity: "0" },
          "50%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        drop: {
          "0%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(1000%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(3px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        growWidth: {
          "0%": { width: "100%" },
          "60%": { width: "0%" },
          "100%": { width: "0%" },
        },
        growHeight: {
          "0%": { height: "0%" },
          "60%": { height: "100%" },
          "100%": { height: "100%" },
        },
        translateY: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        menuScaleOn: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.2)" },
        },
        menuScaleOff: {
          "0%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        rotateInDownRight: {
          from: {
            transform: "rotate3d(0, 0, 1, 45deg)",
            opacity: "0",
          },
        },
        float: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7%)" },
          "100%": { transform: "translateY(0)" },
        },
        pointingY: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20%)" },
          "100%": { transform: "translateY(0)" },
        },
        pointingX: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(0)" },
        },
        floatWater: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15%) rotate(20deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        heartBeat: {
          "0%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.05)" },
          "28%": { transform: "scale(1)" },
          "70%": { transform: "scale(1)" },
        },
        buttonFadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require("./app/tailwind-plugins/padded-horizontal"),
    require("./app/tailwind-plugins/scrollbar-hide"),
  ],
};
export default config;
