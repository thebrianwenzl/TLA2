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