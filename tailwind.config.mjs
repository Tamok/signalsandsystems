/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'h1, h2, h3, h4, h5, h6': {
              fontWeight: '700',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.25',
              color: '#1F2937', // Ensure headers are visible with good contrast
            },
            h1: { 
              fontSize: '2.25rem',
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '0.5rem',
            },
            h2: { 
              fontSize: '1.875rem',
              borderBottom: '1px solid #F3F4F6',
              paddingBottom: '0.25rem',
            },
            h3: { fontSize: '1.5rem' },
            h4: { fontSize: '1.25rem' },
            h5: { fontSize: '1.125rem' },
            h6: { fontSize: '1rem' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            code: {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              borderRadius: '0.25rem',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              borderRadius: '0.5rem',
              padding: '1rem',
              overflowX: 'auto',
            }
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
