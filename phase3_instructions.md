# TLA Project - Phase 3 Implementation Instructions

## Overview
**Goal**: Implement the complete React Native mobile application shell with navigation, authentication screens, state management, and API integration, following the TLA visual design system with custom SVG characters and orange/cream theme.

**Duration**: 5-6 days  
**Complexity**: Medium-High  
**Dependencies**: Phase 2 completed (API backend with authentication and core endpoints functional)

## Phase 3 Objectives

### Primary Goals
1. **Complete Navigation Structure**: Implement bottom tab navigation and stack navigation for all screens
2. **Authentication Flow**: Full user registration, login, and profile management screens with TLA visual design
3. **Redux Store Setup**: Configure Redux Toolkit with RTK Query for API integration
4. **Subject Management**: Subject listing, selection, and detail screens with progress indicators
5. **State Persistence**: Implement AsyncStorage for login state and user preferences
6. **API Integration**: Connect all screens to the Phase 2 API endpoints
7. **TLA Visual Design**: Implement orange/cream theme with custom SVG characters
8. **Typography**: Proper serif font for TLA logo, system fonts for body text
9. **Error Handling**: Comprehensive error states and loading indicators
10. **Responsive Design**: Mobile-first design that works across iOS and Android

### Success Metrics
- Complete authentication flow working end-to-end with API
- Bottom tab navigation functional with all main screens
- Redux store managing auth, subjects, and user progress state
- Persistent login state across app restarts
- Subject listing and detail screens displaying real API data
- TLA visual design implemented with SVG characters
- Loading states and error handling throughout the app
- Responsive design tested on multiple screen sizes

## Technology Stack Verification

### Already Installed Dependencies
```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/bottom-tabs": "^7.4.2",
  "@react-navigation/native": "^7.1.14",
  "@react-navigation/stack": "^7.4.2",
  "@reduxjs/toolkit": "^2.8.2",
  "native-base": "^3.4.28",
  "react-native-reanimated": "^3.18.0",
  "react-native-safe-area-context": "^5.5.2",
  "react-native-screens": "^4.13.1",
  "react-redux": "^9.2.0",
  "redux-persist": "^6.0.0"
}
```

### Additional Dependencies Needed
```bash
cd mobile

# API integration
npm install axios

# Form handling and validation
npm install react-hook-form @hookform/resolvers yup

# SVG support for characters
npm install react-native-svg
npm install react-native-svg-transformer --save-dev

# UI components and icons
npm install react-native-vector-icons
npm install react-native-toast-message

# Development dependencies
npm install @types/react-redux --save-dev

# iOS linking for SVG support
cd ios && pod install && cd ..
```

### SVG Configuration Setup
```javascript
// metro.config.js - Update for SVG support
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();
```

## TLA Visual Design System

### Color Palette
```typescript
// mobile/src/utils/theme.ts
export const colors = {
  primary: '#F97316',      // Orange - main brand color
  primaryLight: '#FB923C', // Lighter orange for highlights
  primaryDark: '#EA580C',  // Darker orange for pressed states
  secondary: '#10B981',    // Green for success states
  background: '#FEF7ED',   // Cream background
  surface: '#FFFFFF',      // White for cards and surfaces
  text: '#1F2937',         // Dark gray for primary text
  textSecondary: '#6B7280', // Medium gray for secondary text
  border: '#E5E7EB',       // Light gray for borders
  error: '#EF4444',        // Red for errors
  success: '#10B981',      // Green for success
  warning: '#F59E0B',      // Amber for warnings
};
```

### Typography System
```typescript
// Font configuration for TLA branding
export const fonts = {
  logo: 'Times New Roman',  // Serif font for TLA logo
  heading: 'System',        // System font for headings
  body: 'System',          // System font for body text
  button: 'System',        // System font for buttons
};

// Font weights
export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
```

### Component Styling Standards
```typescript
// Button variants for TLA design
export const buttonStyles = {
  primary: {
    bg: 'primary',
    rounded: 'full',
    shadow: 2,
    _pressed: { bg: 'primaryDark' },
  },
  game: {
    bg: 'white',
    borderColor: 'border',
    borderWidth: 1,
    rounded: 'full',
    shadow: 1,
    _pressed: { bg: 'gray.50' },
  },
  outline: {
    borderColor: 'primary',
    borderWidth: 2,
    rounded: 'full',
    _pressed: { bg: 'primary.50' },
  },
};
```

## SVG Character Implementation

### Character Library Structure
```
mobile/src/assets/characters/
├── business-person-male.svg
├── business-person-female.svg
├── teacher-male.svg
├── teacher-female.svg
├── student-male.svg
├── student-female.svg
├── professional-finance.svg
├── professional-marketing.svg
└── welcome-character.svg
```

### Character Component Implementation
```typescript
// mobile/src/components/common/CharacterIllustration.tsx
import React from 'react';
import { Box } from 'native-base';

// Import SVG files
import BusinessPersonMale from '../../assets/characters/business-person-male.svg';
import BusinessPersonFemale from '../../assets/characters/business-person-female.svg';
import TeacherMale from '../../assets/characters/teacher-male.svg';
import TeacherFemale from '../../assets/characters/teacher-female.svg';
import StudentMale from '../../assets/characters/student-male.svg';
import StudentFemale from '../../assets/characters/student-female.svg';
import WelcomeCharacter from '../../assets/characters/welcome-character.svg';

const characterMap = {
  'business-person-male': BusinessPersonMale,
  'business-person-female': BusinessPersonFemale,
  'teacher-male': TeacherMale,
  'teacher-female': TeacherFemale,
  'student-male': StudentMale,
  'student-female': StudentFemale,
  'welcome': WelcomeCharacter,
};

export type CharacterType = keyof typeof characterMap;

interface CharacterIllustrationProps {
  type: CharacterType;
  size?: number;
  style?: any;
}

const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({
  type,
  size = 120,
  style,
}) => {
  const CharacterSvg = characterMap[type];

  if (!CharacterSvg) {
    console.warn(`Character type "${type}" not found`);
    return null;
  }

  return (
    <Box alignItems="center" style={style}>
      <CharacterSvg width={size} height={size} />
    </Box>
  );
};

export default CharacterIllustration;
```

### Character Design Specifications
For the SVG characters, we need:

**Style Guidelines:**
- Flat design (no gradients or complex shadows)
- Consistent proportions and scale
- Professional but friendly appearance
- Diverse representation (multiple ethnicities, genders)
- Business casual to professional attire
- Clean, simple lines suitable for mobile display

**Technical Requirements:**
- SVG format for scalability
- Optimized file sizes (<10KB each)
- Consistent viewBox dimensions (preferably square)
- No external dependencies or fonts
- Compatible with react-native-svg

**Character Set Needed:**
1. **Welcome Character**: Friendly, universal appeal for login/welcome screens
2. **Business Person (Male/Female)**: Professional attire, confident posture
3. **Teacher/Instructor**: Academic or training context
4. **Student/Learner**: Learning context, younger appearance
5. **Industry Professionals**: Customizable for different subjects

## Directory Structure Implementation

### Updated Structure with Characters
```
mobile/src/
├── assets/                 # Static assets
│   ├── characters/        # SVG character illustrations
│   ├── fonts/            # Custom fonts (if needed)
│   └── images/           # Other images
├── components/            # Reusable UI components
│   ├── common/           # Shared components
│   │   ├── CharacterIllustration.tsx
│   │   ├── TLALogo.tsx
│   │   ├── GameButton.tsx
│   │   ├── CustomInput.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── forms/            # Form components
│   └── games/            # Game-specific components (for Phase 4)
├── screens/              # Screen components
│   ├── auth/             # Authentication screens
│   ├── subjects/         # Subject selection and details
│   ├── games/            # Game screens (for Phase 4)
│   └── profile/          # User profile screens
├── navigation/           # Navigation configuration
├── store/                # Redux store and slices
│   ├── auth/             # Authentication state
│   ├── subjects/         # Subject data and progress
│   ├── games/            # Game state (for Phase 4)
│   ├── progress/         # User progress tracking
│   └── api/              # RTK Query API slice
├── services/             # API services and utilities
├── utils/                # Utility functions
│   ├── theme.ts          # TLA theme configuration
│   └── constants.ts      # App constants
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## Redux Store Architecture

### Store Configuration
**File: `mobile/src/store/index.ts`**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

import authSlice from './auth/authSlice';
import subjectsSlice from './subjects/subjectsSlice';
import progressSlice from './progress/progressSlice';
import { apiSlice } from './api/apiSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authSlice,
  subjects: subjectsSlice,
  progress: progressSlice,
  api: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice Implementation
**File: `mobile/src/store/auth/authSlice.ts`**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  totalXP: number;
  level: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### RTK Query API Slice
**File: `mobile/src/store/api/apiSlice.ts`**
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api', // Update for production
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Subject', 'Vocabulary'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      { user: any; token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<
      { user: any; token: string },
      { email: string; username: string; password: string; firstName?: string; lastName?: string }
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getProfile: builder.query<{ user: any }, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    
    // Subject endpoints
    getSubjects: builder.query<{ subjects: any[] }, void>({
      query: () => '/subjects',
      providesTags: ['Subject'],
    }),
    getSubjectById: builder.query<{ subject: any }, string>({
      query: (id) => `/subjects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subject', id }],
    }),
    
    // Vocabulary endpoints
    searchVocabulary: builder.query<{ vocabulary: any[] }, string>({
      query: (searchTerm) => `/vocabulary/search?q=${searchTerm}`,
      providesTags: ['Vocabulary'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useSearchVocabularyQuery,
} = apiSlice;
```

## TLA Theme Implementation

### Complete Theme Configuration
**File: `mobile/src/utils/theme.ts`**
```typescript
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
```

### TLA Logo Component
**File: `mobile/src/components/common/TLALogo.tsx`**
```typescript
import React from 'react';
import { VStack, Heading, Text } from 'native-base';

interface TLALogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

const TLALogo: React.FC<TLALogoProps> = ({ 
  size = 'lg', 
  showTagline = true 
}) => {
  const sizeConfig = {
    sm: { heading: 'lg', tagline: 'sm' },
    md: { heading: 'xl', tagline: 'md' },
    lg: { heading: '2xl', tagline: 'lg' },
    xl: { heading: '4xl', tagline: 'xl' },
  };

  return (
    <VStack alignItems="center" space={2}>
      <Heading 
        size={sizeConfig[size].heading}
        color="primary.500"
        fontFamily="Times New Roman" // Serif font for logo
        fontWeight="normal"
      >
        TLA
      </Heading>
      {showTagline && (
        <Text 
          textAlign="center" 
          color="gray.600" 
          fontSize={sizeConfig[size].tagline}
          lineHeight="sm"
        >
          Learn industry jargon{'\n'}through games
        </Text>
      )}
    </VStack>
  );
};

export default TLALogo;
```

## Navigation Implementation

### Main Navigation Structure
**File: `mobile/src/navigation/AppNavigator.tsx`**
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

### Auth Navigation
**File: `mobile/src/navigation/AuthNavigator.tsx`**
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
```

### Bottom Tab Navigation
**File: `mobile/src/navigation/MainTabNavigator.tsx`**
```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SubjectsNavigator from './SubjectsNavigator';
import ProfileNavigator from './ProfileNavigator';
import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Subjects':
              iconName = 'school';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Subjects" component={SubjectsNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
```

## Screen Implementations

### Welcome Screen (New)
**File: `mobile/src/screens/auth/WelcomeScreen.tsx`**
```typescript
import React from 'react';
import { Box, VStack, Button } from 'native-base';

import TLALogo from '../../components/common/TLALogo';
import CharacterIllustration from '../../components/common/CharacterIllustration';

const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Box flex={1} bg="background.50" safeArea>
      <VStack space={8} px={6} py={12} alignItems="center" flex={1} justifyContent="center">
        {/* Character Illustration */}
        <CharacterIllustration type="welcome" size={160} />
        
        {/* TLA Logo and Tagline */}
        <TLALogo size="xl" />
        
        {/* Action Buttons */}
        <VStack space={4} width="full" maxW="sm" mt={8}>
          <Button
            variant="solid"
            size="lg"
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onPress={() => navigation.navigate('Register')}
          >
            Create Account
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default WelcomeScreen;
```

### Updated Login Screen
**File: `mobile/src/screens/auth/LoginScreen.tsx`**
```typescript
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Button, Text, IconButton } from 'native-base';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useLoginMutation } from '../../store/api/apiSlice';
import { loginStart, loginSuccess, loginFailure } from '../../store/auth/authSlice';
import CustomInput from '../../components/common/CustomInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TLALogo from '../../components/common/TLALogo';
import CharacterIllustration from '../../components/common/CharacterIllustration';
import Toast from 'react-native-toast-message';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(loginStart());
      const result = await login(data).unwrap();
      dispatch(loginSuccess(result));
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have successfully logged in.',
      });
    } catch (error: any) {
      dispatch(loginFailure(error.data?.error || 'Login failed'));
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.data?.error || 'Please check your credentials and try again.',
      });
    }
  };

  return (
    <Box flex={1} bg="background.50" safeArea>
      <VStack space={6} px={6} py={8} flex={1}>
        {/* Header with Back Button */}
        <HStack justifyContent="space-between" alignItems="center">
          <IconButton
            icon={<Icon name="arrow-back" size={24} color="#6B7280" />}
            onPress={() => navigation.goBack()}
            variant="ghost"
          />
          <Text />
        </HStack>

        {/* Content */}
        <VStack space={8} alignItems="center" flex={1} justifyContent="center">
          {/* Character and Logo */}
          <VStack space={6} alignItems="center">
            <CharacterIllustration type="business-person-male" size={120} />
            <TLALogo size="lg" showTagline={false} />
          </VStack>

          {/* Login Form */}
          <VStack space={4} width="full" maxW="sm">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading}
              variant="solid"
              size="lg"
              mt={4}
            >
              {isLoading ? <LoadingSpinner /> : 'Sign In'}
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text textAlign="center" color="gray.600" mt={4}>
                Don't have an account?{' '}
                <Text color="primary.500" fontWeight="medium">
                  Sign up here
                </Text>
              </Text>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default LoginScreen;
```

### Updated Register Screen
**File: `mobile/src/screens/auth/RegisterScreen.tsx`**
```typescript
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Button, Text, IconButton } from 'native-base';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useRegisterMutation } from '../../store/api/apiSlice';
import { loginStart, loginSuccess, loginFailure } from '../../store/auth/authSlice';
import CustomInput from '../../components/common/CustomInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TLALogo from '../../components/common/TLALogo';
import CharacterIllustration from '../../components/common/CharacterIllustration';
import Toast from 'react-native-toast-message';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  firstName: yup.string(),
  lastName: yup.string(),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    )
    .required('Password is required'),
});

interface RegisterFormData {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      dispatch(loginStart());
      const result = await register(data).unwrap();
      dispatch(loginSuccess(result));
      Toast.show({
        type: 'success',
        text1: 'Welcome to TLA!',
        text2: 'Your account has been created successfully.',
      });
    } catch (error: any) {
      dispatch(loginFailure(error.data?.error || 'Registration failed'));
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.data?.error || 'Please try again.',
      });
    }
  };

  return (
    <Box flex={1} bg="background.50" safeArea>
      <VStack space={6} px={6} py={8} flex={1}>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <IconButton
            icon={<Icon name="arrow-back" size={24} color="#6B7280" />}
            onPress={() => navigation.goBack()}
            variant="ghost"
          />
          <Text />
        </HStack>

        {/* Content */}
        <VStack space={6} alignItems="center" flex={1}>
          {/* Character and Logo */}
          <VStack space={4} alignItems="center" mt={4}>
            <CharacterIllustration type="student-female" size={100} />
            <TLALogo size="md" showTagline={false} />
            <Text textAlign="center" color="gray.600" fontSize="lg">
              Create your account
            </Text>
          </VStack>

          {/* Registration Form */}
          <VStack space={4} width="full" maxW="sm" flex={1}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Username"
                  placeholder="Choose a username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  autoCapitalize="none"
                />
              )}
            />

            <HStack space={3}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Box flex={1}>
                    <CustomInput
                      label="First Name"
                      placeholder="First name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                    />
                  </Box>
                )}
              />
              
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Box flex={1}>
                    <CustomInput
                      label="Last Name"
                      placeholder="Last name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
                    />
                  </Box>
                )}
              />
            </HStack>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Password"
                  placeholder="Create a password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading}
              variant="solid"
              size="lg"
              mt={4}
            >
              {isLoading ? <LoadingSpinner /> : 'Create Account'}
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text textAlign="center" color="gray.600" mt={4}>
                Already have an account?{' '}
                <Text color="primary.500" fontWeight="medium">
                  Sign in here
                </Text>
              </Text>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default RegisterScreen;
```

### Updated Subjects List Screen
**File: `mobile/src/screens/subjects/SubjectsListScreen.tsx`**
```typescript
import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Text, IconButton } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useGetSubjectsQuery } from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CharacterIllustration from '../../components/common/CharacterIllustration';
import GameButton from '../../components/common/GameButton';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: number;
  _count: {
    vocabulary: number;
  };
}

const SubjectsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { data, error, isLoading, refetch } = useGetSubjectsQuery();

  const renderSubjectButton = ({ item }: { item: Subject }) => (
    <Box mb={3}>
      <GameButton
        title={item.name}
        onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id })}
        variant="option"
      />
    </Box>
  );

  if (isLoading) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center" px={6}>
        <ErrorMessage
          message="Failed to load subjects"
          onRetry={refetch}
        />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="background.50" safeArea>
      <VStack space={6} px={6} py={8} flex={1}>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <IconButton
            icon={<Icon name="arrow-back" size={24} color="#6B7280" />}
            onPress={() => navigation.goBack()}
            variant="ghost"
          />
          <Text />
        </HStack>

        {/* Content */}
        <VStack space={8} alignItems="center" flex={1}>
          {/* Character and Title */}
          <VStack space={6} alignItems="center" mt={4}>
            <CharacterIllustration type="business-person-female" size={120} />
            <Text fontSize="2xl" fontWeight="semibold" textAlign="center" color="gray.800">
              Choose an industry
            </Text>
          </VStack>

          {/* Subject List */}
          <VStack space={3} width="full" maxW="sm" flex={1}>
            <FlatList
              data={data?.subjects || []}
              renderItem={renderSubjectButton}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
              }
            />
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SubjectsListScreen;
```

### Updated Subject Detail Screen
**File: `mobile/src/screens/subjects/SubjectDetailScreen.tsx`**
```typescript
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Progress,
  Divider,
  IconButton,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useGetSubjectByIdQuery } from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CharacterIllustration from '../../components/common/CharacterIllustration';

const SubjectDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { subjectId } = route.params;
  const { data, error, isLoading, refetch } = useGetSubjectByIdQuery(subjectId);

  if (isLoading) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error || !data?.subject) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center" px={6}>
        <ErrorMessage
          message="Failed to load subject details"
          onRetry={refetch}
        />
      </Box>
    );
  }

  const subject = data.subject;

  return (
    <Box flex={1} bg="background.50" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={6}>
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center">
            <IconButton
              icon={<Icon name="arrow-back" size={24} color="#6B7280" />}
              onPress={() => navigation.goBack()}
              variant="ghost"
            />
            <Text />
          </HStack>

          {/* Character and Subject Info */}
          <VStack space={6} alignItems="center">
            <CharacterIllustration 
              type={subject.name === 'Finance' ? 'professional-finance' : 'teacher-male'} 
              size={120} 
            />
            
            <VStack space={2} alignItems="center">
              <Text fontSize="2xl" fontWeight="semibold" textAlign="center" color="gray.800">
                {subject.name}
              </Text>
              <Text color="gray.600" textAlign="center" px={4}>
                {subject.description}
              </Text>
            </VStack>

            <HStack space={3}>
              <Badge
                colorScheme={subject.difficulty <= 2 ? 'green' : subject.difficulty <= 3 ? 'yellow' : 'red'}
                variant="subtle"
                rounded="full"
              >
                Level {subject.difficulty}
              </Badge>
              <Badge colorScheme="blue" variant="subtle" rounded="full">
                {subject._count.vocabulary} terms
              </Badge>
            </HStack>
          </VStack>

          <Divider />

          {/* Progress Section */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold">Your Progress</Text>
            <VStack space={2}>
              <HStack justifyContent="space-between">
                <Text color="gray.600">Overall Progress</Text>
                <Text color="gray.600">0%</Text>
              </HStack>
              <Progress value={0} colorScheme="orange" />
            </VStack>

            <HStack space={4}>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                  0
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Terms Mastered
                </Text>
              </VStack>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  0
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  XP Earned
                </Text>
              </VStack>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  0
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Current Streak
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Divider />

          {/* Sample Terms */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold">Sample Terms</Text>
            {subject.vocabulary?.slice(0, 3).map((term: any) => (
              <Box key={term.id} bg="white" p={4} rounded="lg" shadow={1}>
                <HStack justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontWeight="semibold" fontSize="md">
                    {term.term}
                  </Text>
                  <Badge
                    colorScheme={term.difficulty <= 2 ? 'green' : term.difficulty <= 3 ? 'yellow' : 'red'}
                    variant="subtle"
                    rounded="full"
                  >
                    Level {term.difficulty}
                  </Badge>
                </HStack>
                <Text color="gray.600" mb={1} fontSize="sm">
                  {term.fullForm}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {term.definition}
                </Text>
              </Box>
            ))}
          </VStack>

          {/* Action Buttons */}
          <VStack space={3} mt={6}>
            <Button
              variant="solid"
              size="lg"
              onPress={() => {
                // TODO: Navigate to game session (Phase 4)
                console.log('Start Learning - Phase 4 feature');
              }}
            >
              Start Learning
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onPress={() => {
                // TODO: Navigate to practice mode (Phase 4)
                console.log('Practice Mode - Phase 4 feature');
              }}
            >
              Practice Mode
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onPress={() => {
                // TODO: Navigate to glossary view
                console.log('View Glossary - Future feature');
              }}
            >
              View All Terms
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default SubjectDetailScreen;
```

### Updated Profile Screen
**File: `mobile/src/screens/profile/ProfileScreen.tsx`**
```typescript
import React from 'react';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Divider,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import { logout } from '../../store/auth/authSlice';
import { useGetProfileQuery } from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CharacterIllustration from '../../components/common/CharacterIllustration';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, error, isLoading } = useGetProfileQuery();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => dispatch(logout()) },
      ]
    );
  };

  if (isLoading) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <LoadingSpinner />
      </Box>
    );
  }

  const profileData = data?.user || user;

  return (
    <Box flex={1} bg="background.50" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={6}>
          {/* Profile Header */}
          <VStack space={6} alignItems="center" mt={4}>
            <CharacterIllustration type="student-male" size={120} />
            
            <VStack alignItems="center" space={2}>
              <Text fontSize="2xl" fontWeight="semibold">
                {profileData?.firstName && profileData?.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : profileData?.username}
              </Text>
              <Text color="gray.600" fontSize="md">{profileData?.email}</Text>
            </VStack>
          </VStack>

          <Divider />

          {/* Stats Section */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold">Your Stats</Text>
            <HStack space={4}>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                  {profileData?.totalXP || 0}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Total XP
                </Text>
              </VStack>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {profileData?.level || 1}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Level
                </Text>
              </VStack>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  0
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Subjects Mastered
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Divider />

          {/* Menu Options */}
          <VStack space={3}>
            <Text fontSize="lg" fontWeight="semibold">Settings</Text>
            
            <TouchableOpacity>
              <HStack space={3} alignItems="center" p={4} bg="white" rounded="lg" shadow={1}>
                <Icon name="edit" size={24} color="#6B7280" />
                <Text flex={1} fontSize="md">Edit Profile</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack space={3} alignItems="center" p={4} bg="white" rounded="lg" shadow={1}>
                <Icon name="notifications" size={24} color="#6B7280" />
                <Text flex={1} fontSize="md">Notifications</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack space={3} alignItems="center" p={4} bg="white" rounded="lg" shadow={1}>
                <Icon name="help" size={24} color="#6B7280" />
                <Text flex={1} fontSize="md">Help & Support</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack space={3} alignItems="center" p={4} bg="white" rounded="lg" shadow={1}>
                <Icon name="info" size={24} color="#6B7280" />
                <Text flex={1} fontSize="md">About</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </HStack>
            </TouchableOpacity>
          </VStack>

          {/* Sign Out Button */}
          <Button
            variant="outline"
            colorScheme="red"
            onPress={handleLogout}
            mt={6}
            size="lg"
          >
            Sign Out
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ProfileScreen;
```

## Common Components

### Game Button Component
**File: `mobile/src/components/common/GameButton.tsx`**
```typescript
import React from 'react';
import { Button, Text } from 'native-base';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  variant?: 'primary' | 'option';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  isSelected = false,
  isDisabled = false,
  variant = 'option',
  size = 'lg',
}) => {
  const getButtonProps = () => {
    if (variant === 'primary') {
      return {
        variant: 'solid',
        bg: 'primary.500',
        _pressed: { bg: 'primary.600' },
      };
    }

    return {
      variant: 'game',
      bg: isSelected ? 'primary.100' : 'white',
      borderColor: isSelected ? 'primary.500' : 'gray.300',
      _pressed: { bg: isSelected ? 'primary.200' : 'gray.50' },
    };
  };

  return (
    <Button
      onPress={onPress}
      isDisabled={isDisabled}
      size={size}
      width="full"
      justifyContent="flex-start"
      px={6}
      py={4}
      {...getButtonProps()}
    >
      <Text
        color={variant === 'primary' ? 'white' : isSelected ? 'primary.600' : 'gray.800'}
        fontSize="md"
        fontWeight={isSelected ? 'semibold' : 'normal'}
      >
        {title}
      </Text>
    </Button>
  );
};

export default GameButton;
```

### Updated Custom Input Component
**File: `mobile/src/components/common/CustomInput.tsx`**
```typescript
import React from 'react';
import { FormControl, Input, Text } from 'native-base';

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => {
  return (
    <FormControl isInvalid={!!error} mb={2}>
      <FormControl.Label mb={2}>
        <Text fontSize="md" fontWeight="medium" color="gray.700">
          {label}
        </Text>
      </FormControl.Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        size="lg"
        rounded="lg"
        bg="white"
        borderColor="gray.300"
        _focus={{
          borderColor: 'primary.500',
          bg: 'white',
        }}
        _invalid={{
          borderColor: 'error.500',
        }}
      />
      {error && (
        <FormControl.ErrorMessage mt={1}>
          <Text fontSize="sm" color="error.500">
            {error}
          </Text>
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

export default CustomInput;
```

### Loading Spinner Component
**File: `mobile/src/components/common/LoadingSpinner.tsx`**
```typescript
import React from 'react';
import { Spinner, HStack, Text } from 'native-base';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text, 
  size = 'lg',
  color = 'primary.500'
}) => {
  if (text) {
    return (
      <HStack space={2} alignItems="center">
        <Spinner size={size} color={color} />
        <Text color="gray.600">{text}</Text>
      </HStack>
    );
  }

  return <Spinner size={size} color={color} />;
};

export default LoadingSpinner;
```

### Error Message Component
**File: `mobile/src/components/common/ErrorMessage.tsx`**
```typescript
import React from 'react';
import { VStack, Text, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <VStack space={4} alignItems="center" maxW="sm">
      <Icon name="error-outline" size={48} color="#EF4444" />
      <Text textAlign="center" color="gray.600" fontSize="md">
        {message}
      </Text>
      {onRetry && (
        <Button variant="outline" onPress={onRetry} size="md">
          Try Again
        </Button>
      )}
    </VStack>
  );
};

export default ErrorMessage;
```

## App.tsx Update

**File: `mobile/src/App.tsx`**
```typescript
import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

import { store, persistor } from './store';
import AppNavigator from './navigation/AppNavigator';
import LoadingSpinner from './components/common/LoadingSpinner';
import { theme } from './utils/theme';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner text="Loading..." />} persistor={persistor}>
        <NativeBaseProvider theme={theme}>
          <AppNavigator />
          <Toast />
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
```

## SVG Character Creation Guide

### Character Design Requirements

**Visual Style:**
- Flat design with minimal details
- Consistent color palette using TLA theme colors
- Professional but approachable appearance
- Diverse representation (ethnicity, gender, age)
- Clear silhouettes that work at small sizes

**Technical Specifications:**
- SVG format with viewBox="0 0 120 120"
- Optimized file size (<10KB each)
- No external fonts or dependencies
- Compatible with react-native-svg
- Consistent proportions across all characters

**Character Set Priority:**
1. **Welcome Character** - Universal, friendly for onboarding
2. **Business Person (Male/Female)** - Professional attire, confident
3. **Teacher/Instructor** - Academic context, authoritative but approachable
4. **Student/Learner** - Younger, enthusiastic for learning
5. **Industry Professionals** - Customizable per subject (finance, marketing, etc.)

### Sample SVG Structure
```svg
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle (optional) -->
  <circle cx="60" cy="60" r="55" fill="#F97316" opacity="0.1"/>
  
  <!-- Character body -->
  <rect x="45" y="70" width="30" height="40" rx="2" fill="#065f46"/>
  
  <!-- Character head -->
  <circle cx="60" cy="50" r="15" fill="#fbbf24"/>
  
  <!-- Additional details (hair, face, etc.) -->
  <path d="..." fill="#374151"/>
</svg>
```

## Implementation Steps

### Step 1: Install Dependencies and Configure SVG Support
```bash
cd mobile

# Install additional packages
npm install axios react-hook-form @hookform/resolvers yup
npm install react-native-svg react-native-svg-transformer --save-dev
npm install react-native-vector-icons react-native-toast-message
npm install @types/react-redux --save-dev

# Configure Metro for SVG support
# Update metro.config.js (see configuration above)

# Link dependencies (iOS)
cd ios && pod install && cd ..
```

### Step 2: Setup SVG Characters
1. Create `mobile/src/assets/characters/` directory
2. Add placeholder SVG files or commission character artwork
3. Implement `CharacterIllustration` component with SVG imports
4. Test character rendering on different screen sizes

### Step 3: Implement TLA Theme
1. Create `mobile/src/utils/theme.ts` with orange/cream color scheme
2. Create `TLALogo` component with serif font
3. Update all components to use new theme colors
4. Test theme consistency across all screens

### Step 4: Setup Redux Store
1. Create `mobile/src/store/index.ts` with store configuration
2. Create `mobile/src/store/auth/authSlice.ts` with authentication state
3. Create `mobile/src/store/api/apiSlice.ts` with RTK Query setup
4. Create placeholder slices for subjects and progress

### Step 5: Implement Navigation
1. Create `mobile/src/navigation/AppNavigator.tsx` - Main navigation logic
2. Create `mobile/src/navigation/AuthNavigator.tsx` - Authentication flow
3. Create `mobile/src/navigation/MainTabNavigator.tsx` - Bottom tab navigation
4. Update navigation styling to match TLA theme

### Step 6: Build Common Components
1. Create `mobile/src/components/common/CharacterIllustration.tsx`
2. Create `mobile/src/components/common/TLALogo.tsx`
3. Create `mobile/src/components/common/GameButton.tsx`
4. Update existing common components with TLA styling

### Step 7: Implement Authentication Screens
1. Create `mobile/src/screens/auth/WelcomeScreen.tsx`
2. Update `mobile/src/screens/auth/LoginScreen.tsx` with TLA design
3. Update `mobile/src/screens/auth/RegisterScreen.tsx` with TLA design
4. Test authentication flow with Phase 2 API

### Step 8: Implement Subject Screens
1. Update `mobile/src/screens/subjects/SubjectsListScreen.tsx` with TLA design
2. Update `mobile/src/screens/subjects/SubjectDetailScreen.tsx` with TLA design
3. Integrate character illustrations based on subject type

### Step 9: Implement Profile Screen
1. Update `mobile/src/screens/profile/ProfileScreen.tsx` with TLA design
2. Add character illustration and stats display

### Step 10: Update App.tsx and Type Definitions
1. Integrate Redux Provider and PersistGate
2. Add NativeBaseProvider with TLA theme
3. Create `mobile/src/types/index.ts` with all TypeScript interfaces

### Step 11: Testing and Polish
1. Test authentication flow end-to-end
2. Test navigation between all screens with TLA design
3. Test character rendering and theme consistency
4. Test state persistence across app restarts

## Acceptance Criteria

### Must Complete Successfully:
- [ ] User can register a new account through the mobile app with TLA design
- [ ] User can login with existing credentials using TLA-styled screens
- [ ] Login state persists across app restarts
- [ ] Bottom tab navigation works with TLA theme colors
- [ ] Subjects list screen displays with character illustrations and game buttons
- [ ] Subject detail screen shows TLA design with appropriate characters
- [ ] Profile screen displays user information with TLA styling
- [ ] Loading states display with TLA theme colors
- [ ] Error states display with TLA styling and retry options
- [ ] Form validation works with TLA-styled input components
- [ ] App works on both iOS and Android simulators
- [ ] Redux store properly manages authentication and subject state
- [ ] RTK Query handles API caching and invalidation
- [ ] SVG characters render correctly across all screens
- [ ] TLA logo displays with proper serif font
- [ ] Orange/cream theme is consistently applied throughout

### API Integration Tests:
- [ ] Registration creates user in database and returns JWT token
- [ ] Login authenticates user and returns JWT token
- [ ] Protected API calls include JWT token in headers
- [ ] Subjects list loads from `/api/subjects` endpoint
- [ ] Subject detail loads from `/api/subjects/:id` endpoint
- [ ] Profile data loads from `/api/auth/profile` endpoint
- [ ] Logout clears authentication state and persisted data

### Design System Tests:
- [ ] Orange primary color (#F97316) used consistently
- [ ] Cream background (#FEF7ED) applied to all screens
- [ ] Character illustrations render at correct sizes
- [ ] Game buttons have proper rounded styling with borders
- [ ] TLA logo uses serif font (Times New Roman)
- [ ] Theme works correctly in light mode
- [ ] Navigation elements use TLA color scheme

### Character Implementation Tests:
- [ ] SVG characters load without errors
- [ ] Characters scale properly on different screen sizes
- [ ] Character selection logic works (different characters per context)
- [ ] Character illustrations match TLA design guidelines
- [ ] Performance is acceptable with SVG rendering

## Testing Strategy

### Manual Testing Checklist
1. **TLA Design Testing**
   - Verify orange/cream color scheme throughout app
   - Test character illustrations on different screens
   - Verify TLA logo uses serif font
   - Test button styling matches game design
   - Verify responsive design on different screen sizes

2. **Authentication Flow Testing**
   - Register new user with TLA-styled forms
   - Login with TLA-styled screens
   - Test form validation with TLA error styling
   - Test logout functionality

3. **Navigation Testing**
   - Navigate between screens with TLA theme
   - Test tab navigation styling
   - Test character consistency across screens

4. **API Integration Testing**
   - Test with Phase 2 API server running
   - Test offline error handling with TLA styling
   - Test loading states with TLA spinner

### Automated Testing Setup
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Test TypeScript compilation
npx tsc --noEmit
```

## Environment Configuration

### Development Environment
```bash
# API Base URL for development
API_BASE_URL=http://localhost:3000/api

# For iOS simulator
API_BASE_URL=http://localhost:3000/api

# For Android emulator
API_BASE_URL=http://10.0.2.2:3000/api
```

### Character Assets Strategy
For Phase 3, we have two options:

**Option A: Commission Custom SVGs (Recommended)**
- Hire designer/illustrator for TLA character set
- Estimated cost: $200-500 for full character library
- Timeline: 3-5 days for design completion

**Option B: Temporary Placeholders**
- Use styled emoji or simple geometric shapes
- Replace with custom artwork post-Phase 3
- Faster implementation, lower initial cost

## Risk Mitigation

### Technical Risks
- **SVG Performance**: Test character rendering performance on older devices
- **Font Loading**: Ensure serif font loads correctly across platforms
- **Theme Consistency**: Maintain TLA design system across all components
- **Character File Sizes**: Optimize SVG files to prevent bundle bloat

### Project Risks
- **Character Artwork Delay**: Have placeholder strategy ready
- **Design Complexity**: Maintain functional requirements while implementing visual design
- **API Integration**: Ensure TLA styling doesn't break API functionality

## Success Metrics

### Phase 3 Success (TLA Design Implementation)
- Complete TLA visual design system implemented
- All screens feature appropriate character illustrations
- Orange/cream theme consistently applied
- Serif font TLA logo properly rendered
- User authentication flow works with TLA styling
- Subject browsing experience matches sample designs
- Performance remains acceptable with SVG characters

### Final Success Criteria
- App visually matches TLA design guidelines
- Character illustrations enhance user experience
- Navigation feels smooth and branded
- All functional requirements from original Phase 3 met
- Ready for Phase 4 game implementation
- Code quality meets established standards
- Design system is maintainable and extensible

---

**Phase 3 Success Criteria**: Complete mobile app shell with TLA visual design system, character illustrations, authentication, navigation, and subject management ready for game implementation in Phase 4.