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