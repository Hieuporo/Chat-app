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
        wd: "calc(100% - 801px)",
        ws: "calc(100% - 351px)",
        wl: "calc(100% - 417px)",
      },
    },
  },
  plugins: [],
};
