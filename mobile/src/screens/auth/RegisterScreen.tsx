import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Button, Text, IconButton } from 'native-base';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import { useRegisterMutation } from '../../store/api/apiSlice';
import { loginStart, loginSuccess, loginFailure } from '../../store/auth/authSlice';
import CustomInput from '../../components/common/CustomInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TLALogo from '../../components/common/TLALogo';
import CharacterIllustration from '../../components/common/CharacterIllustration';

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
            <CharacterIllustration type="business-person-female" size={100} />
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
                      value={value || ''}
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
                      value={value || ''}
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