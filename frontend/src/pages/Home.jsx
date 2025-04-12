import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  SimpleGrid,
  Flex,
  Image,
  Icon,
  Stack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { FiCreditCard, FiShield, FiRefreshCw, FiGlobe, FiSend, FiArrowRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack 
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="md"
      borderRadius="lg"
      p={5}
      className="card-hover"
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={useColorModeValue('blue.500', 'blue.300')}
        rounded={'full'}
        bg={useColorModeValue('blue.50', 'blue.900')}
        mb={4}
      >
        <Icon as={icon} w={10} h={10} />
      </Flex>
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </Stack>
  );
};

const Home = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        color="white"
        py={20}
        px={4}
        borderRadius="lg"
        mb={10}
        className="fade-in"
      >
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
            <Box>
              <Heading as="h1" size="2xl" mb={4} className="slide-up">
                Fast, Secure Digital Payments for Everyone
              </Heading>
              <Text fontSize="xl" mb={6} opacity={0.9} className="slide-up">
                Send money, make payments, and manage your finances with our modern digital wallet.
              </Text>
              <HStack spacing={4} className="slide-up">
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  colorScheme="white"
                  bg="white"
                  color="blue.500"
                  _hover={{ bg: 'gray.100' }}
                  rightIcon={<FiArrowRight />}
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  size="lg"
                  variant="outline"
                  colorScheme="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Log In
                </Button>
              </HStack>
            </Box>
            <Flex justify="center">
              <Image
                src="https://via.placeholder.com/500x400?text=Wallet+Illustration"
                alt="Digital Wallet"
                borderRadius="lg"
                shadow="2xl"
                maxW="500px"
                w="100%"
              />
            </Flex>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" mb={20}>
        <Heading as="h2" size="xl" mb={12} textAlign="center" className="fade-in">
          Why Choose Our Wallet
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          <Feature
            icon={FiShield}
            title="Secure Transactions"
            text="Bank-level security ensures your money and data stay safe"
          />
          <Feature
            icon={FiSend}
            title="Instant Transfers"
            text="Send money to anyone, anywhere in the world instantly"
          />
          <Feature
            icon={FiCreditCard}
            title="Multiple Payment Options"
            text="Connect cards, bank accounts, and other payment methods"
          />
          <Feature
            icon={FiRefreshCw}
            title="Automatic Payments"
            text="Schedule recurring payments and never miss a bill"
          />
          <Feature
            icon={FiGlobe}
            title="Global Coverage"
            text="Use our wallet for transactions in multiple currencies"
          />
          <Feature
            icon={FiCreditCard}
            title="Cashback Rewards"
            text="Earn rewards on qualifying transactions and payments"
          />
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Box bg={useColorModeValue('gray.100', 'gray.700')} py={16} borderRadius="lg">
        <Container maxW="container.lg" textAlign="center">
          <Heading as="h2" size="xl" mb={4}>
            Ready to Start?
          </Heading>
          <Text fontSize="lg" mb={8} maxW="600px" mx="auto" color={useColorModeValue('gray.600', 'gray.300')}>
            Join thousands of users who trust our platform for their digital payment needs.
          </Text>
          <Button
            as={RouterLink}
            to="/register"
            size="lg"
            colorScheme="blue"
            px={8}
            rightIcon={<FiArrowRight />}
          >
            Create Your Wallet Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 