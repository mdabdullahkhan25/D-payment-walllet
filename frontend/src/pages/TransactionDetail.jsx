import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Button,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Flex,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { transactionService } from '../services/api';
import { ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon, RepeatIcon, CheckIcon, InfoIcon } from '@chakra-ui/icons';
import { FiCalendar, FiInfo, FiCreditCard, FiUser, FiMessageSquare } from 'react-icons/fi';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        const response = await transactionService.getTransaction(id);
        setTransaction(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch transaction details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransactionDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type, amount) => {
    if (type === 'deposit' || (amount > 0 && type === 'transfer')) {
      return <ArrowDownIcon color="green.500" boxSize={6} />;
    } else if (type === 'withdrawal' || (amount < 0 && (type === 'transfer' || type === 'payment'))) {
      return <ArrowUpIcon color="red.500" boxSize={6} />;
    } else {
      return <RepeatIcon color="blue.500" boxSize={6} />;
    }
  };

  const getStatusBadge = (status) => {
    let colorScheme, icon;
    
    switch (status) {
      case 'completed':
        colorScheme = 'green';
        icon = CheckIcon;
        break;
      case 'pending':
        colorScheme = 'yellow';
        icon = InfoIcon;
        break;
      case 'failed':
        colorScheme = 'red';
        icon = InfoIcon;
        break;
      default:
        colorScheme = 'gray';
        icon = InfoIcon;
    }
    
    return (
      <Badge colorScheme={colorScheme} p={2} borderRadius="md">
        <HStack spacing={1}>
          <Icon as={icon} />
          <Text textTransform="capitalize">{status}</Text>
        </HStack>
      </Badge>
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box>
        <Skeleton height="40px" mb={4} />
        <Skeleton height="100px" mb={4} />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
          <Skeleton height="80px" />
          <Skeleton height="80px" />
          <Skeleton height="80px" />
          <Skeleton height="80px" />
        </SimpleGrid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!transaction) {
    return (
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        Transaction not found
      </Alert>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: transaction.currency || 'USD',
      signDisplay: 'always',
    }).format(amount);
  };

  return (
    <Box>
      <Button leftIcon={<ArrowLeftIcon />} variant="outline" mb={6} onClick={handleGoBack}>
        Back to Transactions
      </Button>

      <Heading as="h1" size="xl" mb={6} color={headingColor}>
        Transaction Details
      </Heading>

      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" mb={6} borderWidth="1px" borderColor={borderColor}>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} mb={4}>
          <HStack>
            {getTransactionIcon(transaction.type, transaction.amount)}
            <Heading as="h2" size="md" textTransform="capitalize">
              {transaction.type} {transaction.status === 'failed' && ' (Failed)'}
            </Heading>
          </HStack>
          {getStatusBadge(transaction.status)}
        </Flex>

        <Heading as="h3" size="2xl" mb={6} color={transaction.amount > 0 ? 'green.500' : 'red.500'}>
          {formatCurrency(transaction.amount)}
        </Heading>

        <Divider mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <HStack spacing={2} mb={3}>
              <Icon as={FiCalendar} color={textColor} />
              <Text color={textColor} fontWeight="medium">Date</Text>
            </HStack>
            <Text>{formatDate(transaction.createdAt)}</Text>
          </Box>

          <Box>
            <HStack spacing={2} mb={3}>
              <Icon as={FiInfo} color={textColor} />
              <Text color={textColor} fontWeight="medium">Reference</Text>
            </HStack>
            <Text>{transaction.reference || '-'}</Text>
          </Box>

          <Box>
            <HStack spacing={2} mb={3}>
              <Icon as={FiCreditCard} color={textColor} />
              <Text color={textColor} fontWeight="medium">Payment Method</Text>
            </HStack>
            <Text textTransform="capitalize">{transaction.paymentMethod}</Text>
          </Box>

          {transaction.recipient && (
            <Box>
              <HStack spacing={2} mb={3}>
                <Icon as={FiUser} color={textColor} />
                <Text color={textColor} fontWeight="medium">Recipient</Text>
              </HStack>
              <Text>{transaction.recipient.name || transaction.recipient}</Text>
            </Box>
          )}
        </SimpleGrid>

        {transaction.description && (
          <>
            <Divider my={6} />
            <Box>
              <HStack spacing={2} mb={3}>
                <Icon as={FiMessageSquare} color={textColor} />
                <Text color={textColor} fontWeight="medium">Description</Text>
              </HStack>
              <Text>{transaction.description}</Text>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TransactionDetail; 