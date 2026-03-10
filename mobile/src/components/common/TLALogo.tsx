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