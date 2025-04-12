import React, { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Flex,
  Text,
  Button,
  useColorModeValue,
  useDisclosure,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import { FiPlus, FiSend, FiCreditCard } from 'react-icons/fi';
import WalletCard from '../components/WalletCard';
import AddFundsModal from '../components/modals/AddFundsModal';
import TransferModal from '../components/modals/TransferModal';
import { useWallet } from '../contexts/WalletContext';

const PaymentMethodCard = ({ title, icon, action, description, isActive = false }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeBorder = useColorModeValue('blue.300', 'blue.600');

  return (
    <Card 
      bg={isActive ? activeBg : bg}
      borderWidth="1px"
      borderColor={isActive ? activeBorder : borderColor}
      borderRadius="lg"
      className="card-hover"
      cursor="pointer"
      onClick={action}
    >
      <CardHeader pb={0}>
        <Flex align="center" justify="space-between">
          <Heading size="md">{title}</Heading>
          <Icon as={icon} boxSize={6} color={isActive ? 'blue.500' : 'gray.400'} />
        </Flex>
      </CardHeader>
      <CardBody py={2}>
        <Text color="gray.500" fontSize="sm">
          {description}
        </Text>
      </CardBody>
      <CardFooter pt={0}>
        <Button size="sm" variant={isActive ? "solid" : "outline"} colorScheme="blue" onClick={action}>
          {isActive ? 'Selected' : 'Select'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Wallet = () => {
  const { wallet } = useWallet();
  const headingColor = useColorModeValue('gray.700', 'white');
  const addFundsDisclosure = useDisclosure();
  const transferDisclosure = useDisclosure();
  const paymentDisclosure = useDisclosure();
  const [activeMethod, setActiveMethod] = useState('add');

  const handleMethodSelect = (method) => {
    setActiveMethod(method);
    if (method === 'add') {
      addFundsDisclosure.onOpen();
    } else if (method === 'transfer') {
      transferDisclosure.onOpen();
    }
  };

  return (
    <Box>
      <Flex direction="column" mb={6}>
        <Heading as="h1" size="xl" color={headingColor}>
          My Wallet
        </Heading>
        <Text color="gray.500" mt={1}>
          Manage your funds and payment methods
        </Text>
      </Flex>

      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={6}
        mb={8}
      >
        <GridItem colSpan={{ base: 1, md: 3 }}>
          <WalletCard />
        </GridItem>
      </Grid>

      <Box mb={8}>
        <Heading as="h2" size="md" color={headingColor} mb={4}>
          Wallet Operations
        </Heading>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={4}
        >
          <PaymentMethodCard
            title="Add Funds"
            icon={FiPlus}
            action={() => handleMethodSelect('add')}
            description="Add money to your wallet via credit card or bank transfer"
            isActive={activeMethod === 'add'}
          />
          <PaymentMethodCard
            title="Transfer Money"
            icon={FiSend}
            action={() => handleMethodSelect('transfer')}
            description="Send money to other users or external accounts"
            isActive={activeMethod === 'transfer'}
          />
          <PaymentMethodCard
            title="Payment Methods"
            icon={FiCreditCard}
            action={() => handleMethodSelect('payment')}
            description="Manage your cards and linked payment accounts"
            isActive={activeMethod === 'payment'}
          />
        </Grid>
      </Box>

      <AddFundsModal isOpen={addFundsDisclosure.isOpen} onClose={addFundsDisclosure.onClose} />
      <TransferModal isOpen={transferDisclosure.isOpen} onClose={transferDisclosure.onClose} />
    </Box>
  );
};

export default Wallet; 