import React from 'react';
import { Box, Heading, Text, Button, VStack, Image, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      py={10}
      px={6}
      minHeight="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="lg"
      bg={bgColor}
      className="fade-in"
    >
      <VStack spacing={8} textAlign="center">
        <Heading
          display="inline-block"
          as="h1"
          size="4xl"
          color={useColorModeValue('blue.500', 'blue.300')}
        >
          404
        </Heading>
        <Heading as="h2" size="xl" color={textColor}>
          Page Not Found
        </Heading>
        <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button
          as={RouterLink}
          to="/"
          colorScheme="blue"
          size="lg"
          fontWeight="bold"
          px={6}
        >
          Go to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound; 