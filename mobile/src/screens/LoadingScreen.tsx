import React from 'react';
import { Box } from 'native-base';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoadingScreen: React.FC = () => {
  return (
    <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
      <LoadingSpinner text="Loading..." />
    </Box>
  );
};

export default LoadingScreen;