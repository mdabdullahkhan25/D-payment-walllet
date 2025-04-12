import React from 'react';
import { Box, Container, Flex, Text, Link, useColorModeValue } from '@chakra-ui/react';
import Header from './Header';

const Footer = () => {
  const bg = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box bg={bg} color={textColor} as="footer" py={4} mt="auto">
      <Container maxW="container.xl">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align="center"
        >
          <Text fontSize="sm">
            © {new Date().getFullYear()} D-Payment Wallet. All rights reserved.
          </Text>
          <Flex mt={{ base: 2, md: 0 }} gap={4}>
            <Link fontSize="sm" href="#">Privacy Policy</Link>
            <Link fontSize="sm" href="#">Terms of Service</Link>
            <Link fontSize="sm" href="#">Contact</Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box flex="1" as="main" py={4}>
        <Container maxW="container.xl" className="fade-in">
          {children}
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout; 