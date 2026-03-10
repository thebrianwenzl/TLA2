import React from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Progress,
  Divider,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootState } from '../../store';
import { clearResults } from '../../store/games/gamesSlice';
import CharacterIllustration from '../../components/common/CharacterIllustration';

const GameResultsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { sessionResults } = useSelector((state: RootState) => state.games);

  if (!sessionResults) {
    navigation.replace('Subjects');
    return null;
  }

  const handleContinue = () => {
    dispatch(clearResults());
    navigation.navigate('Subjects');
  };

  const handlePlayAgain = () => {
    dispatch(clearResults());
    // Navigate back to the same subject to start a new game
    navigation.navigate('SubjectDetail', { subjectId: sessionResults.sessionId });
  };

  const getPerformanceMessage = () => {
    if (sessionResults.accuracy >= 80) return "Excellent work!";
    if (sessionResults.accuracy >= 60) return "Good job!";
    if (sessionResults.accuracy >= 40) return "Keep practicing!";
    return "Don't give up!";
  };

  const getCharacterType = () => {
    if (sessionResults.accuracy >= 80) return "business-person-female";
    if (sessionResults.accuracy >= 60) return "business-person-male";
    return "student-male";
  };

  return (
    <Box flex={1} bg="background.50" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={8} p={6}>
          {/* Header */}
          <VStack space={6} alignItems="center" mt={4}>
            <CharacterIllustration type={getCharacterType()} size={120} />
            
            <VStack alignItems="center" space={2}>
              <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="gray.800">
                Session Complete!
              </Text>
              <Text fontSize="lg" color="gray.600" textAlign="center">
                {sessionResults.subjectName}
              </Text>
              <Text fontSize="md" color="primary.600" fontWeight="medium">
                {getPerformanceMessage()}
              </Text>
            </VStack>
          </VStack>

          <Divider />

          {/* Performance Stats */}
          <VStack space={6}>
            <Text fontSize="lg" fontWeight="semibold">Performance Summary</Text>
            
            {/* Accuracy */}
            <VStack space={2}>
              <HStack justifyContent="space-between">
                <Text color="gray.600">Accuracy</Text>
                <Text color="gray.800" fontWeight="medium">{sessionResults.accuracy}%</Text>
              </HStack>
              <Progress 
                value={sessionResults.accuracy} 
                colorScheme={sessionResults.accuracy >= 80 ? "green" : sessionResults.accuracy >= 60 ? "orange" : "red"}
                size="sm" 
                rounded="full"
              />
            </VStack>

            {/* Stats Grid */}
            <HStack space={4}>
              <VStack flex={1} alignItems="center" space={1} bg="white" p={4} rounded="lg" shadow={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                  {sessionResults.correctAnswers}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Correct Answers
                </Text>
              </VStack>
              
              <VStack flex={1} alignItems="center" space={1} bg="white" p={4} rounded="lg" shadow={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {sessionResults.xpEarned}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  XP Earned
                </Text>
              </VStack>
              
              <VStack flex={1} alignItems="center" space={1} bg="white" p={4} rounded="lg" shadow={1}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {sessionResults.totalChallenges}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Total Questions
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Divider />

          {/* Detailed Results */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold">Question Review</Text>
            
            {sessionResults.attempts.map((attempt, index) => (
              <Box key={index} bg="white" p={4} rounded="lg" shadow={1}>
                <VStack space={2}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="md" fontWeight="medium" flex={1}>
                      Q{index + 1}: {attempt.challengePrompt}
                    </Text>
                    <Icon 
                      name={attempt.isCorrect ? "check-circle" : "cancel"} 
                      size={24} 
                      color={attempt.isCorrect ? "#10B981" : "#EF4444"} 
                    />
                  </HStack>
                  
                  <VStack space={1}>
                    <Text fontSize="sm" color="gray.600">
                      Your answer: <Text color={attempt.isCorrect ? "success.600" : "error.600"}>
                        {attempt.userAnswer}
                      </Text>
                    </Text>
                    {!attempt.isCorrect && (
                      <Text fontSize="sm" color="gray.600">
                        Correct answer: <Text color="success.600">{attempt.correctAnswer}</Text>
                      </Text>
                    )}
                    {attempt.xpEarned > 0 && (
                      <Text fontSize="sm" color="primary.600">
                        +{attempt.xpEarned} XP
                      </Text>
                    )}
                  </VStack>
                </VStack>
              </Box>
            ))}
          </VStack>

          {/* Action Buttons */}
          <VStack space={3} mt={6}>
            <Button
              variant="solid"
              size="lg"
              onPress={handleContinue}
              bg="primary.500"
              _pressed={{ bg: "primary.600" }}
            >
              Continue Learning
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onPress={handlePlayAgain}
              borderColor="primary.500"
              _text={{ color: "primary.500" }}
              _pressed={{ bg: "primary.50" }}
            >
              Play Again
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default GameResultsScreen;