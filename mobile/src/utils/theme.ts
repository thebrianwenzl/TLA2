import { extendTheme } from 'native-base';

export const colors = {
  primary: '#F97316',
  primaryLight: '#FB923C',
  primaryDark: '#EA580C',
  secondary: '#10B981',
  background: '#FEF7ED',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',   // Main orange
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    background: {
      50: '#FEF7ED',    // Main cream background
      100: '#FFFFFF',   // Card backgrounds
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  fonts: {
    heading: 'System',
    body: 'System',
    mono: 'System',
  },
  fontSizes: {
    '2xs': 10,
    'xs': 12,
    'sm': 14,
    'md': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 'full',
        _text: {
          fontWeight: 'medium',
        },
      },
      variants: {
        solid: {
          bg: 'primary.500',
          _pressed: { bg: 'primary.600' },
          _text: { color: 'white' },
          shadow: 2,
        },
        outline: {
          borderColor: 'primary.500',
          borderWidth: 2,
          _pressed: { bg: 'primary.50' },
          _text: { color: 'primary.500' },
        },
        game: {
          bg: 'white',
          borderColor: 'gray.300',
          borderWidth: 1,
          shadow: 1,
          _pressed: { bg: 'gray.50' },
          _text: { color: 'gray.800' },
        },
        ghost: {
          _pressed: { bg: 'gray.100' },
          _text: { color: 'gray.600' },
        },
      },
      sizes: {
        sm: { px: 4, py: 2, _text: { fontSize: 'sm' } },
        md: { px: 6, py: 3, _text: { fontSize: 'md' } },
        lg: { px: 8, py: 4, _text: { fontSize: 'lg' } },
        xl: { px: 10, py: 5, _text: { fontSize: 'xl' } },
      },
    },
    Input: {
      baseStyle: {
        rounded: 'lg',
        borderColor: 'gray.300',
        _focus: {
          borderColor: 'primary.500',
          bg: 'white',
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
  },
});