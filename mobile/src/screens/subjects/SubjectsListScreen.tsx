import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Box, VStack, HStack, Text, IconButton } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useGetSubjectsQuery } from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import CharacterIllustration from '../../components/common/CharacterIllustration';
import GameButton from '../../components/common/GameButton';

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: number;
  _count: {
    vocabulary: number;
  };
}

const SubjectsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { data, error, isLoading, refetch } = useGetSubjectsQuery();

  const renderSubjectButton = ({ item }: { item: Subject }) => (
    <Box mb={3}>
      <GameButton
        title={item.name}
        onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id })}
        variant="option"
      />
    </Box>
  );

  if (isLoading) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center" px={6}>
        <ErrorMessage
          message="Failed to load subjects"
          onRetry={refetch}
        />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="background.50" safeArea>
      <VStack space={6} px={6} py={8} flex={1}>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <IconButton
            icon={<Icon name="arrow-back" size={24} color="#6B7280" />}
            onPress={() => navigation.goBack()}
            variant="ghost"
          />
          <Text />
        </HStack>

        {/* Content */}
        <VStack space={8} alignItems="center" flex={1}>
          {/* Character and Title */}
          <VStack space={6} alignItems="center" mt={4}>
            <CharacterIllustration type="business-person-female" size={120} />
            <Text fontSize="2xl" fontWeight="semibold" textAlign="center" color="gray.800">
              Choose an industry
            </Text>
          </VStack>

          {/* Subject List */}
          <VStack space={3} width="full" maxW="sm" flex={1}>
            <FlatList
              data={data?.subjects || []}
              renderItem={renderSubjectButton}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
              }
            />
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SubjectsListScreen;