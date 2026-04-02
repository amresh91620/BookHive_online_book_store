/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "2rem",
      },
      screens: {
        "2xl": "72rem",
      },
    },
  	extend: {
  		colors: {
  			ink: 'rgb(var(--ink) / <alpha-value>)',
  			paper: 'rgb(var(--paper) / <alpha-value>)',
  			honey: 'rgb(var(--honey) / <alpha-value>)',
  			clay: 'rgb(var(--clay) / <alpha-value>)',
  			leaf: 'rgb(var(--leaf) / <alpha-value>)',
  			sky: 'rgb(var(--sky) / <alpha-value>)',
  			// Vibrant Orange/Amber Theme
  			orange: {
  				50: '#fff7ed',
  				100: '#ffedd5',
  				200: '#fed7aa',
  				300: '#fdba74',
  				400: '#fb923c',
  				500: '#f97316',  // Primary vibrant orange
  				600: '#ea580c',  // Hover state
  				700: '#c2410c',
  				800: '#9a3412',
  				900: '#7c2d12',
  			},
  			amber: {
  				50: '#fffbeb',
  				100: '#fef3c7',
  				200: '#fde68a',
  				300: '#fcd34d',
  				400: '#fbbf24',
  				500: '#f59e0b',  // Primary amber
  				600: '#d97706',  // Hover state
  				700: '#b45309',
  				800: '#92400e',
  				900: '#78350f',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			display: [
  				'Plus Jakarta Sans',
  				'system-ui',
  				'sans-serif'
  			],
  			body: [
  				'Plus Jakarta Sans',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'sans-serif'
  			],
  			serif: [
  				'Playfair Display',
  				'Georgia',
  				'serif'
  			],
  			sans: [
  				'Plus Jakarta Sans',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			glow: '0 20px 60px rgba(11, 122, 113, 0.16)',
  			soft: '0 10px 30px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.04)',
  			medium: '0 18px 48px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.06)',
  			large: '0 28px 80px rgba(15, 23, 42, 0.12), 0 12px 30px rgba(15, 23, 42, 0.08)',
  			premium: '0 24px 70px rgba(15, 23, 42, 0.14), 0 8px 20px rgba(15, 23, 42, 0.08)'
  		},
  		borderRadius: {
  			xl: '1.25rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-8px)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			fadeIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideIn: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					transform: 'scale(0.9)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			}
  		},
  		animation: {
  			float: 'float 6s ease-in-out infinite',
  			shimmer: 'shimmer 2.5s linear infinite',
  			fadeIn: 'fadeIn 0.5s ease-out',
  			slideIn: 'slideIn 0.4s ease-out',
  			scaleIn: 'scaleIn 0.3s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
