/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Karla: ["Karla", "sans-serif"],
      },
      height: {
        vh: "calc(100vh - 56px)",
      },
      width: {
        wf: "calc(100% - 32px)",
      },
    },
  },
  plugins: [],
};
