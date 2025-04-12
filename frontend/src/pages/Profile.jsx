import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Flex,
  Divider,
  useColorModeValue,
  useToast,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  IconButton,
} from '@chakra-ui/react';
import { FiEdit, FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // In a real app, you would call an API to update the profile
      // const response = await authService.updateProfile(profileData);
      
      // For now, we'll just update the local state
      updateProfile({
        ...user,
        ...profileData,
      });
      
      setIsEditing(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form data to current user data when entering edit mode
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  };

  if (!user) {
    return (
      <Alert status="warning">
        <AlertIcon />
        Please login to view your profile
      </Alert>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} color={headingColor}>
        My Profile
      </Heading>
      
      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {/* Profile Information */}
        <Card bg={bgColor} boxShadow="md" borderWidth="1px" borderColor={borderColor} borderRadius="lg">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">Personal Information</Heading>
              <IconButton
                icon={<FiEdit />}
                aria-label="Edit profile"
                variant="ghost"
                onClick={toggleEdit}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" align="center" mb={6}>
              <Avatar
                size="2xl"
                name={user.name}
                mb={4}
                bg="teal.500"
              />
              <Text fontSize="xl" fontWeight="bold">
                {user.name}
              </Text>
              <Text color="gray.500">
                {user.role}
              </Text>
            </Flex>
            
            <Divider mb={6} />
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl id="name">
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <FormControl id="email">
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      isReadOnly
                      bg={useColorModeValue('gray.100', 'gray.700')}
                    />
                  </FormControl>
                  
                  <FormControl id="phone">
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <Flex justify="flex-end" mt={4}>
                    <Button variant="outline" mr={3} onClick={toggleEdit}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      isLoading={loading}
                    >
                      Save Changes
                    </Button>
                  </Flex>
                </VStack>
              </form>
            ) : (
              <VStack spacing={6} align="stretch">
                <Flex align="center">
                  <Box p={2} bg="blue.50" borderRadius="full" mr={4}>
                    <FiUser color="blue.500" />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Full Name</Text>
                    <Text fontWeight="medium">{user.name}</Text>
                  </Box>
                </Flex>
                
                <Flex align="center">
                  <Box p={2} bg="green.50" borderRadius="full" mr={4}>
                    <FiMail color="green.500" />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Email Address</Text>
                    <Text fontWeight="medium">{user.email}</Text>
                  </Box>
                </Flex>
                
                <Flex align="center">
                  <Box p={2} bg="purple.50" borderRadius="full" mr={4}>
                    <FiPhone color="purple.500" />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Phone Number</Text>
                    <Text fontWeight="medium">{user.phone}</Text>
                  </Box>
                </Flex>
              </VStack>
            )}
          </CardBody>
        </Card>
        
        {/* Account Security */}
        <Card bg={bgColor} boxShadow="md" borderWidth="1px" borderColor={borderColor} borderRadius="lg">
          <CardHeader>
            <Heading size="md">Account Security</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Flex align="center">
                <Box p={2} bg="red.50" borderRadius="full" mr={4}>
                  <FiLock color="red.500" />
                </Box>
                <Box flex="1">
                  <Text fontSize="sm" color="gray.500">Password</Text>
                  <Text fontWeight="medium">••••••••</Text>
                </Box>
                <Button size="sm" variant="outline">
                  Change
                </Button>
              </Flex>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={4}>Account Activity</Heading>
                
                <VStack spacing={4} align="stretch">
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Text fontWeight="medium">Last Login</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date().toLocaleString()}
                    </Text>
                  </Box>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Text fontWeight="medium">Account Created</Text>
                    <Text fontSize="sm" color="gray.500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </Text>
                  </Box>
                </VStack>
              </Box>
              
              <Divider />
              
              <Button colorScheme="red" variant="outline">
                Deactivate Account
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Profile; 