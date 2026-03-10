import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Progress } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';

import { RootState } from '../../store';
import {
  startSessionRequest,
  startSessionSuccess,
  startSessionFailure,
  submitAnswerRequest,
  submitAnswerSuccess,
  submitAnswerFailure,
  completeSessionRequest,
  completeSessionSuccess,
  completeSessionFailure,
  updateTimer,
  stopTimer,
} from '../../store/games/gamesSlice';
import {
  useStartGameSessionMutation,
  useSubmitChallengeAttemptMutation,
  useCompleteGameSessionMutation,
} from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CharacterIllustration from '../../components/common/CharacterIllustration';
import GameButton from '../../components/common/GameButton';
import Toast from 'react-native-toast-message';

const GameScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { subjectId, sessionType = 'main_path' } = route.params;
  
  const {
    currentSession,
    currentChallenge,
    lastResult,
    isLoading,
    error,
    timeRemaining,
    isTimerActive,
  } = useSelector((state: RootState) => state.games);

  const [startGameSession] = useStartGameSessionMutation();
  const [submitChallengeAttempt] = useSubmitChallengeAttemptMutation();
  const [completeGameSession] = useCompleteGameSessionMutation();

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  // Start game session on component mount
  useEffect(() => {
    handleStartSession();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(updateTimer(timeRemaining - 1));
      }, 1000);
    } else if (timeRemaining === 0 && isTimerActive) {
      // Time's up - auto submit
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const handleStartSession = async () => {
    try {
      dispatch(startSessionRequest());
      const result = await startGameSession({ subjectId, sessionType }).unwrap();
      dispatch(startSessionSuccess(result));
    } catch (error: any) {
      dispatch(startSessionFailure(error.data?.error || 'Failed to start game session'));
      Toast.show({
        type: 'error',
        text1: 'Game Start Failed',
        text2: error.data?.error || 'Unable to start the game. Please try again.',
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!showResult && !isLoading) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentSession || !currentChallenge) return;

    const timeTaken = (currentChallenge.timeLimit - timeRemaining) * 1000; // Convert to milliseconds

    try {
      dispatch(submitAnswerRequest());
      const result = await submitChallengeAttempt({
        sessionId: currentSession.id,
        challengeId: currentChallenge.id,
        userAnswer: selectedAnswer,
        timeTaken,
      }).unwrap();

      dispatch(submitAnswerSuccess(result));
      setShowResult(true);

      // Show result feedback
      Toast.show({
        type: result.result.isCorrect ? 'success' : 'error',
        text1: result.result.isCorrect ? 'Correct!' : 'Incorrect',
        text2: result.result.isCorrect 
          ? `+${result.result.xpEarned} XP` 
          : `Correct answer: ${result.result.correctAnswer}`,
      });

      // Auto-advance after showing result
      setTimeout(() => {
        if (result.nextChallenge) {
          setShowResult(false);
          setSelectedAnswer('');
        } else {
          handleCompleteSession();
        }
      }, 3000);

    } catch (error: any) {
      dispatch(submitAnswerFailure(error.data?.error || 'Failed to submit answer'));
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error.data?.error || 'Unable to submit answer. Please try again.',
      });
    }
  };

  const handleTimeUp = async () => {
    dispatch(stopTimer());
    if (selectedAnswer) {
      await handleSubmitAnswer();
    } else {
      // Auto-submit with no answer
      setSelectedAnswer('');
      await handleSubmitAnswer();
    }
  };

  const handleCompleteSession = async () => {
    if (!currentSession) return;

    try {
      dispatch(completeSessionRequest());
      const result = await completeGameSession(currentSession.id).unwrap();
      dispatch(completeSessionSuccess(result.results));
      
      // Navigate to results screen
      navigation.replace('GameResults');
    } catch (error: any) {
      dispatch(completeSessionFailure(error.data?.error || 'Failed to complete session'));
      Toast.show({
        type: 'error',
        text1: 'Session Completion Failed',
        text2: error.data?.error || 'Unable to complete session. Please try again.',
      });
    }
  };

  if (isLoading && !currentChallenge) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <LoadingSpinner text="Starting game..." />
      </Box>
    );
  }

  if (error && !currentChallenge) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center" px={6}>
        <ErrorMessage
          message={error}
          onRetry={handleStartSession}
        />
      </Box>
    );
  }

  if (!currentChallenge || !currentSession) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <Text>No challenge available</Text>
      </Box>
    );
  }

  const progressPercentage = ((currentSession.currentChallenge + 1) / currentSession.totalChallenges) * 100;

  return (
    <Box flex={1} bg="background.50" safeArea>
      <VStack space={6} px={6} py={8} flex={1}>
        {/* Header with Progress */}
        <VStack space={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              {currentSession.subjectName}
            </Text>
            <Text fontSize="md" color="gray.600">
              {currentSession.currentChallenge + 1} of {currentSession.totalChallenges}
            </Text>
          </HStack>
          
          <Progress 
            value={progressPercentage} 
            colorScheme="orange" 
            size="sm" 
            rounded="full"
          />
        </VStack>

        {/* Timer */}
        <HStack justifyContent="center" alignItems="center" space={2}>
          <Text fontSize="2xl" fontWeight="bold" color={timeRemaining <= 10 ? "error.500" : "primary.500"}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </Text>
        </HStack>

        {/* Character Illustration */}
        <Box alignItems="center">
          <CharacterIllustration type="student-male" size={100} />
        </Box>

        {/* Challenge Content */}
        <VStack space={6} flex={1}>
          {/* Question */}
          <Box bg="white" p={6} rounded="xl" shadow={2}>
            <Text fontSize="lg" fontWeight="medium" textAlign="center" color="gray.800">
              {currentChallenge.prompt}
            </Text>
          </Box>

          {/* Answer Options */}
          <VStack space={3} flex={1}>
            {currentChallenge.options.map((option, index) => {
              let variant: 'primary' | 'option' = 'option';
              let isSelected = selectedAnswer === option;
              
              if (showResult && lastResult) {
                if (option === lastResult.correctAnswer) {
                  variant = 'primary';
                  isSelected = true;
                } else if (selectedAnswer === option && !lastResult.isCorrect) {
                  // Keep as option variant but selected to show it was chosen incorrectly
                  isSelected = true;
                }
              }
              
              return (
                <GameButton
                  key={index}
                  title={option}
                  onPress={() => handleAnswerSelect(option)}
                  isSelected={isSelected}
                  isDisabled={showResult || isLoading}
                  variant={variant}
                />
              );
            })}
          </VStack>

          {/* Submit Button */}
          {!showResult && (
            <GameButton
              title={isLoading ? 'Submitting...' : 'Submit Answer'}
              onPress={handleSubmitAnswer}
              isDisabled={!selectedAnswer || isLoading}
              variant="primary"
            />
          )}

          {/* Result Display */}
          {showResult && lastResult && (
            <Box bg={lastResult.isCorrect ? "success.50" : "error.50"} p={4} rounded="lg">
              <VStack space={2} alignItems="center">
                <Text 
                  fontSize="lg" 
                  fontWeight="bold" 
                  color={lastResult.isCorrect ? "success.600" : "error.600"}
                >
                  {lastResult.isCorrect ? 'Correct!' : 'Incorrect'}
                </Text>
                {!lastResult.isCorrect && (
                  <Text fontSize="md" color="gray.700" textAlign="center">
                    Correct answer: {lastResult.correctAnswer}
                  </Text>
                )}
                {lastResult.xpEarned > 0 && (
                  <Text fontSize="md" color="primary.600" fontWeight="medium">
                    +{lastResult.xpEarned} XP
                  </Text>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default GameScreen;