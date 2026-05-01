import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        edward: {
          amber:  '#F59E0B',   // primary brand
          navy:   '#1F2937',   // dark bg
          navy2:  '#374151',   // sidebar items
          teal:   '#0F766E',   // success / positive
          coral:  '#E11D48',   // leaks / warnings
          muted:  '#6B7280',   // secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    }
  },
  plugins: [],
};

export default config;
