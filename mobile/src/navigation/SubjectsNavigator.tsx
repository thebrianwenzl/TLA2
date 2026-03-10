import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SubjectsListScreen from '../screens/subjects/SubjectsListScreen';
import SubjectDetailScreen from '../screens/subjects/SubjectDetailScreen';
import GameScreen from '../screens/games/GameScreen';
import GameResultsScreen from '../screens/games/GameResultsScreen';

const Stack = createStackNavigator();

const SubjectsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SubjectsList" component={SubjectsListScreen} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="GameResults" component={GameResultsScreen} />
    </Stack.Navigator>
  );
};

export default SubjectsNavigator;