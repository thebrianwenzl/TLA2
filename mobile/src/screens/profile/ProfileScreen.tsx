import React from 'react';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import { logout } from '../../store/auth/authSlice';
import { useGetProfileQuery } from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CharacterIllustration from '../../components/common/CharacterIllustration';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => (state.auth as any));
  const { data, error, isLoading } = useGetProfileQuery();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => dispatch(logout()) },
      ]
    );
  };

  if (isLoading) {
    return (
      <Box flex={1} bg="background.50" justifyContent="center" alignItems="center">
        <LoadingSpinner />
      </Box>
    );
  }

  const profileData = data?.user || user;

  return (
    <Box flex={1} bg="background.50" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={6}>
          {/* Profile Header */}
          <VStack space={6} alignItems="center" mt={4}>
            <CharacterIllustration type="student-male" size={120} />
            
            <VStack alignItems="center" space={2}>
              <Text fontSize="2xl" fontWeight="semibold">
                {profileData?.firstName && profileData?.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : profileData?.username}
              </Text>
              <Text color="gray.600" fontSize="md">{profileData?.email}</Text>
            </VStack>
          </VStack>

          <Divider />

          {/* Stats Section */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold">Your Stats</Text>
            <HStack space={4}>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                  {profileData?.totalXP || 0}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Total XP
                </Text>
              </VStack>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {profileData?.level || 1}
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Level
                </Text>
              </VStack>
              <VStack flex={1} alignItems="center" space={1}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  0
                </Text>
                <Text color="gray.600" textAlign="center" fontSize="sm">
                  Subjects Mastered
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Divider />

          {/* Menu Options */}
          <VStack space={3}>
            <Text fontSize="lg" fontWeight="semibold">Settings</Text>
            
            <TouchableOpacity>
              <HStack space={3} alignItems="center" p={4} bg="white" rounded="lg" shadow={1}>
                <Icon name="edit" size={24} color="#6B7280" />
                <Text flex={1} fontSize="md">Edit Profile</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack space={3} alignItems="center" p={4} bg="white" rounded="lg" shadow={1}>
                <Icon name="notifications" size={24} color="#6B7280" />
                <Text flex={1} fontSize="md">Notifications</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack space={3} alignItems="center" p={4} bg="white" rounded="lg" shadow={1}>
                <Icon name="help" size={24} color="#6B7280" />
                <Text flex={1} fontSize="md">Help & Support</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack space={3} alignItems="center" p={4} bg="white" rounded="lg" shadow={1}>
                <Icon name="info" size={24} color="#6B7280" />
                <Text flex={1} fontSize="md">About</Text>
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              </HStack>
            </TouchableOpacity>
          </VStack>

          {/* Sign Out Button */}
          <Button
            variant="outline"
            colorScheme="red"
            onPress={handleLogout}
            mt={6}
            size="lg"
          >
            Sign Out
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ProfileScreen;