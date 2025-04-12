import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Button, Stack, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box 
      as="nav" 
      bg={colorMode === 'light' ? 'white' : 'gray.800'} 
      px={4} 
      py={2} 
      boxShadow="md" 
      position="sticky" 
      top={0} 
      zIndex={10}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={toggle}
        />

        <Flex alignItems="center">
          <Link to="/" className="navbar-item">
            <Text fontSize="lg" fontWeight="bold" color={colorMode === 'light' ? 'primary.500' : 'primary.300'}>
              D-Payment Wallet
            </Text>
          </Link>
        </Flex>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: isOpen ? 'flex' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
          spacing={6}
          justifyContent={{ md: 'center' }}
        >
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="navbar-item">
                <Text>Dashboard</Text>
              </Link>
              <Link to="/wallet" className="navbar-item">
                <Text>Wallet</Text>
              </Link>
              <Link to="/transactions" className="navbar-item">
                <Text>Transactions</Text>
              </Link>
              <Link to="/payment" className="navbar-item">
                <Text>Payments</Text>
              </Link>
            </>
          )}
        </Stack>

        <Flex alignItems={'center'}>
          <Button onClick={toggleColorMode} mr={4}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>

          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar size={'sm'} name={user?.name} />
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile">Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={6}
            >
              <Button
                as={Link}
                to="/login"
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                colorScheme="teal"
                bg={'teal.400'}
                color={'white'}
                _hover={{
                  bg: 'teal.500',
                }}
              >
                Register
              </Button>
            </Stack>
          )}
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="navbar-item" onClick={toggle}>
                  <Text>Dashboard</Text>
                </Link>
                <Link to="/wallet" className="navbar-item" onClick={toggle}>
                  <Text>Wallet</Text>
                </Link>
                <Link to="/transactions" className="navbar-item" onClick={toggle}>
                  <Text>Transactions</Text>
                </Link>
                <Link to="/payment" className="navbar-item" onClick={toggle}>
                  <Text>Payments</Text>
                </Link>
                <Link to="/profile" className="navbar-item" onClick={toggle}>
                  <Text>Profile</Text>
                </Link>
                <Button variant="link" onClick={handleLogout}>
                  <Text>Logout</Text>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-item" onClick={toggle}>
                  <Text>Login</Text>
                </Link>
                <Link to="/register" className="navbar-item" onClick={toggle}>
                  <Text>Register</Text>
                </Link>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Header; 