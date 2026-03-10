import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Button, Text, IconButton } from 'native-base';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import { useLoginMutation } from '../../store/api/apiSlice';
import { loginStart, loginSuccess, loginFailure } from '../../store/auth/authSlice';
import CustomInput from '../../components/common/CustomInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TLALogo from '../../components/common/TLALogo';
import CharacterIllustration from '../../components/common/CharacterIllustration';

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