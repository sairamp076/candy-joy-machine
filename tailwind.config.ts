
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom candy colors
				candy: {
					fivestar: '#FFD700',
					milkybar: '#FFFAF0',
					dairymilk: '#7B3F00',
					eclairs: '#D2691E',
					machine: {
						primary: '#F0F4F8',
						secondary: '#E1E8ED',
						accent: '#D66853',
						display: 'rgba(220, 230, 240, 0.4)',
						tray: 'rgba(200, 210, 220, 0.7)',
						metal: '#B8C2CC',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'candy-drop': {
					'0%': { transform: 'translateY(-100%)', opacity: '1' },
					'70%': { transform: 'translateY(5%)', opacity: '1' },
					'80%': { transform: 'translateY(-5%)', opacity: '1' },
					'90%': { transform: 'translateY(0%)', opacity: '1' },
					'100%': { transform: 'translateY(0%)', opacity: '1' }
				},
				'candy-bounce': {
					'0%': { transform: 'translateY(0) rotate(0deg)' },
					'20%': { transform: 'translateY(-30px) rotate(10deg)' },
					'40%': { transform: 'translateY(0) rotate(0deg)' },
					'60%': { transform: 'translateY(-15px) rotate(-5deg)' },
					'80%': { transform: 'translateY(0) rotate(0deg)' },
					'100%': { transform: 'translateY(0) rotate(0deg)' }
				},
				'button-press': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fall-in': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'shine': {
					'0%': { backgroundPosition: '200% 0' },
					'100%': { backgroundPosition: '-200% 0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'candy-drop': 'candy-drop 1s ease-in-out forwards',
				'candy-bounce': 'candy-bounce 0.8s ease-in-out',
				'button-press': 'button-press 0.3s ease-in-out',
				'fade-in': 'fade-in 0.5s ease-in-out',
				'fall-in': 'fall-in 0.4s ease-out',
				'shine': 'shine 3s linear infinite',
				'float': 'float 3s ease-in-out infinite'
			},
			backgroundImage: {
				'metal-gradient': 'linear-gradient(135deg, #D1D5DB 0%, #E5E7EB 50%, #D1D5DB 100%)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)',
				'button-gradient': 'linear-gradient(to right, #D1D5DB, #F3F4F6, #D1D5DB)',
                'shine-effect': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
			},
			boxShadow: {
				'candy-glow': '0 0 15px rgba(255, 215, 0, 0.5)',
				'inner-light': 'inset 0 0 10px rgba(255, 255, 255, 0.5)',
				'inner-shadow': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'candy-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
