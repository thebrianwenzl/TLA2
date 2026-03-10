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