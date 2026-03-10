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