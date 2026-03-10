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