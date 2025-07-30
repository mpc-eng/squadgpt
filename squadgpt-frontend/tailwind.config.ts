import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Color System - ShadCN + Custom SquadGPT Colors
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // SquadGPT Specific Colors
        squad: {
          business: 'hsl(var(--squad-business))',
          product: 'hsl(var(--squad-product))',
          technical: 'hsl(var(--squad-technical))',
          scrum: 'hsl(var(--squad-scrum))',
        },
        // Status Colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      // Border Radius System
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      // Spacing System
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Animation System
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      // Typography System
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      // Shadow System
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
      },
      // Z-Index System
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'auto': 'auto',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
      // Custom Utilities
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    // Custom Plugin for Component Classes
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        // Card Components
        '.card': {
          backgroundColor: theme('colors.card.DEFAULT'),
          color: theme('colors.card.foreground'),
          borderRadius: theme('borderRadius.lg'),
          border: `1px solid ${theme('colors.border')}`,
          boxShadow: theme('boxShadow.sm'),
        },
        '.card-hover': {
          '&:hover': {
            boxShadow: theme('boxShadow.md'),
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
        
        // Button Components
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          border: '1px solid transparent',
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.none'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.DEFAULT'),
          color: theme('colors.primary.foreground'),
          '&:hover': {
            backgroundColor: theme('colors.primary.DEFAULT / 0.9'),
          },
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: `0 0 0 2px ${theme('colors.ring')}`,
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.secondary.DEFAULT'),
          color: theme('colors.secondary.foreground'),
          '&:hover': {
            backgroundColor: theme('colors.secondary.DEFAULT / 0.8'),
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.foreground'),
          '&:hover': {
            backgroundColor: theme('colors.accent.DEFAULT'),
            color: theme('colors.accent.foreground'),
          },
        },
        
        // Input Components
        '.input': {
          display: 'block',
          width: '100%',
          borderRadius: theme('borderRadius.md'),
          border: `1px solid ${theme('colors.input')}`,
          backgroundColor: theme('colors.background'),
          color: theme('colors.foreground'),
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.none'),
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            borderColor: theme('colors.ring'),
            boxShadow: `0 0 0 2px ${theme('colors.ring / 0.2')}`,
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        
        // Chat Bubble Components
        '.chat-bubble': {
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.3'),
          maxWidth: '75%',
          wordWrap: 'break-word',
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.relaxed'),
        },
        '.chat-bubble-user': {
          backgroundColor: theme('colors.primary.DEFAULT'),
          color: theme('colors.primary.foreground'),
          marginLeft: 'auto',
        },
        '.chat-bubble-agent': {
          backgroundColor: theme('colors.muted.DEFAULT'),
          color: theme('colors.muted.foreground'),
          marginRight: 'auto',
        },
        
        // Status Indicators
        '.status-dot': {
          width: theme('spacing.2'),
          height: theme('spacing.2'),
          borderRadius: '50%',
          display: 'inline-block',
        },
        '.status-dot-success': {
          backgroundColor: theme('colors.success.DEFAULT'),
        },
        '.status-dot-warning': {
          backgroundColor: theme('colors.warning.DEFAULT'),
        },
        '.status-dot-error': {
          backgroundColor: theme('colors.destructive.DEFAULT'),
        },
        '.status-dot-info': {
          backgroundColor: theme('colors.info.DEFAULT'),
        },
        
        // Scrollbar Styling
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.muted.DEFAULT'),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.border'),
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: theme('colors.muted.foreground'),
            },
          },
        },
        
        // Animation Utilities
        '.animate-fade-in': {
          animation: 'fadeIn 0.5s ease-in-out',
        },
        '.animate-slide-up': {
          animation: 'slideUp 0.3s ease-out',
        },
        '.animate-scale-in': {
          animation: 'scaleIn 0.2s ease-out',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

export default config