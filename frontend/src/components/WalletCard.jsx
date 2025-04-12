import React, { useState } from 'react';
import { Box, Text, Flex, Button, useColorMode, CircularProgress, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '../contexts/WalletContext';
import AddFundsModal from './modals/AddFundsModal';
import TransferModal from './modals/TransferModal';

const WalletCard = () => {
  const { wallet, loading } = useWallet();
  const { colorMode } = useColorMode();
  const addFundsDisclosure = useDisclosure();
  const transferDisclosure = useDisclosure();

  if (loading) {
    return (
      <Flex justify="center" align="center" p={6}>
        <CircularProgress isIndeterminate color="teal.500" />
      </Flex>
    );
  }

  if (!wallet) {
    return (
      <Box
        className="wallet-card"
        bgGradient={colorMode === 'light' ? 'linear(to-r, gray.200, gray.300)' : 'linear(to-r, gray.700, gray.800)'}
        p={6}
        borderRadius="lg"
        boxShadow="md"
      >
        <Text>No wallet information available.</Text>
      </Box>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet.currency || 'USD',
    }).format(amount);
  };

  return (
    <>
      <Box
        className="wallet-card slide-up"
        bgGradient="linear(to-r, blue.500, purple.500)"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        color="white"
        position="relative"
        overflow="hidden"
      >
        <Box 
          position="absolute" 
          top="-20px" 
          right="-20px" 
          width="140px" 
          height="140px" 
          borderRadius="50%" 
          bg="rgba(255,255,255,0.1)" 
          zIndex="0"
        />
        
        <Box position="relative" zIndex="1">
          <Text fontSize="sm" opacity="0.8" mb={1}>Total Balance</Text>
          <Text className="balance pulse" fontSize="3xl" fontWeight="bold">
            {formatCurrency(wallet.balance)}
          </Text>
          
          <Text fontSize="sm" mt={4} mb={2} opacity="0.8">Wallet ID</Text>
          <Text fontSize="md" fontWeight="medium">
            {wallet._id?.substring(0, 12) + '...'}
          </Text>
          
          <Flex className="wallet-actions" mt={6} justifyContent="space-between">
            <Button 
              size="md" 
              colorScheme="whiteAlpha" 
              onClick={addFundsDisclosure.onOpen}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              Add Funds
            </Button>
            <Button 
              size="md" 
              colorScheme="whiteAlpha" 
              onClick={transferDisclosure.onOpen}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              Transfer
            </Button>
          </Flex>
        </Box>
      </Box>
      
      <AddFundsModal isOpen={addFundsDisclosure.isOpen} onClose={addFundsDisclosure.onClose} />
      <TransferModal isOpen={transferDisclosure.isOpen} onClose={transferDisclosure.onClose} />
    </>
  );
};

export default WalletCard; 