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