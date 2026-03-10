import React from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Progress,
  Divider,
  IconButton,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useGetSubjectByIdQuery } from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CharacterIllustration from '../../components/common/CharacterIllustration';

const SubjectDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { subjectId } = route.params;
  const { data, error, isLoading, refetch } = useGetSubjectByIdQuery(subjectId);

  if (isLoading) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error || !data?.subject) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center" px={6}>
        <ErrorMessage
          message="Failed to load subject details"
          onRetry={refetch}
        />
      </Box>
    );
  }

  const subject = data.subject;

  return (
    <Box flex={1} bg="background.50" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={6}>
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center">
            <IconButton
              icon={<Icon name="arrow-back" size={24} color="#6B7280" />}
              onPress={() => navigation.goBack()}
              variant="ghost"
            />
            <Text />
          </HStack>

          {/* Character and Subject Info */}
          <VStack space={6} alignItems="center">
            <CharacterIllustration 
              type={subject.name === 'Finance' ? 'business-person-male' : 'business-person-female'} 
              size={120} 
            />
            
            <VStack space={2} alignItems="center">
              <Text fontSize="2xl" fontWeight="semibold" textAlign="center" color="gray.800">
                {subject.name}
              </Text>
              <Text color="gray.600" textAlign="center" px={4}>
                {subject.description}
              </Text>
            </VStack>

            <HStack space={3}>
              <Badge
                colorScheme={subject.difficulty <= 2 ? 'green' : subject.difficulty <= 3 ? 'yellow' : 'red'}
                variant="subtle"
                rounded="full"
              >
                Level {subject.difficulty}
              </Badge>
              <Badge colorScheme="blue" variant="subtle" rounded="full">
                {subject._count.vocabulary} terms
              </Badge>
            </HStack>
          </VStack>

          <Divider />

          {/* Progress Section */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold">Your Progress</Text>
            <VStack space={2}>
              <HStack justifyContent="space-between">
                <Text color="gray.600">Overall Progress</Text>
                <Text color="gray.600">0%</Text>
              </HStack>
              <Progress value={0} colorScheme="orange" />
            </VStack>

            <HStack space={4}>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                  0
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Terms Mastered
                </Text>
              </VStack>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  0
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  XP Earned
                </Text>
              </VStack>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  0
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Current Streak
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Divider />

          {/* Sample Terms */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold">Sample Terms</Text>
            {subject.vocabulary?.slice(0, 3).map((term: any) => (
              <Box key={term.id} bg="white" p={4} rounded="lg" shadow={1}>
                <HStack justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontWeight="semibold" fontSize="md">
                    {term.term}
                  </Text>
                  <Badge
                    colorScheme={term.difficulty <= 2 ? 'green' : term.difficulty <= 3 ? 'yellow' : 'red'}
                    variant="subtle"
                    rounded="full"
                  >
                    Level {term.difficulty}
                  </Badge>
                </HStack>
                <Text color="gray.600" mb={1} fontSize="sm">
                  {term.fullForm}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {term.definition}
                </Text>
              </Box>
            ))}
          </VStack>

          {/* Action Buttons */}
          <VStack space={3} mt={6}>
            <Button
              variant="solid"
              size="lg"
              onPress={() => {
                navigation.navigate('Game', { subjectId: subject.id, sessionType: 'main_path' });
              }}
              bg="primary.500"
              _pressed={{ bg: "primary.600" }}
            >
              Start Learning
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onPress={() => {
                navigation.navigate('Game', { subjectId: subject.id, sessionType: 'practice' });
              }}
              borderColor="primary.500"
              _text={{ color: "primary.500" }}
              _pressed={{ bg: "primary.50" }}
            >
              Practice Mode
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onPress={() => {
                // TODO: Navigate to glossary view (future feature)
                console.log('View Glossary - Future feature');
              }}
              _text={{ color: "gray.600" }}
              _pressed={{ bg: "gray.50" }}
            >
              View All Terms
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default SubjectDetailScreen;