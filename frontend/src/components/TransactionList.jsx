import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Flex,
  Button,
  Skeleton,
  useColorModeValue,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { useTransaction } from '../contexts/TransactionContext';
import { ArrowUpIcon, ArrowDownIcon, TimeIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const TransactionList = ({ limit = 5, showViewAll = true }) => {
  const { transactions, loading, pagination } = useTransaction();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTransactionIcon = (type, amount) => {
    if (type === 'deposit' || (amount > 0 && type === 'transfer')) {
      return <ArrowDownIcon color="green.500" />;
    } else if (type === 'withdrawal' || (amount < 0 && (type === 'transfer' || type === 'payment'))) {
      return <ArrowUpIcon color="red.500" />;
    } else {
      return <TimeIcon color="gray.500" />;
    }
  };

  const getStatusBadge = (status) => {
    let colorScheme;
    
    switch (status) {
      case 'completed':
        colorScheme = 'green';
        break;
      case 'pending':
        colorScheme = 'yellow';
        break;
      case 'failed':
        colorScheme = 'red';
        break;
      default:
        colorScheme = 'gray';
    }
    
    return <Badge colorScheme={colorScheme}>{status}</Badge>;
  };

  const getTransactionColor = (amount) => {
    return amount > 0 ? 'green.500' : 'red.500';
  };

  if (loading) {
    return (
      <Box rounded="md" bg={bg} boxShadow="sm" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </Box>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Box rounded="md" bg={bg} boxShadow="sm" p={4} borderWidth="1px" borderColor={borderColor}>
        <Text textAlign="center" color="gray.500">No transactions found</Text>
      </Box>
    );
  }

  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <Box rounded="md" bg={bg} boxShadow="sm" overflow="hidden" borderWidth="1px" borderColor={borderColor} className="fade-in">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Amount</Th>
            <Th display={{ base: 'none', md: 'table-cell' }}>Date</Th>
            <Th display={{ base: 'none', md: 'table-cell' }}>Status</Th>
            <Th textAlign="right">Details</Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayTransactions.map((transaction) => (
            <Tr key={transaction._id} className="transaction-item" _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
              <Td>
                <Flex alignItems="center">
                  <Tooltip label={transaction.type}>
                    <Box mr={2}>
                      {getTransactionIcon(transaction.type, transaction.amount)}
                    </Box>
                  </Tooltip>
                  <Text fontWeight="medium" textTransform="capitalize">
                    {transaction.type}
                  </Text>
                </Flex>
              </Td>
              <Td color={getTransactionColor(transaction.amount)}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: transaction.currency || 'USD',
                }).format(transaction.amount)}
              </Td>
              <Td display={{ base: 'none', md: 'table-cell' }}>
                {formatDate(transaction.createdAt)}
              </Td>
              <Td display={{ base: 'none', md: 'table-cell' }}>
                {getStatusBadge(transaction.status)}
              </Td>
              <Td textAlign="right">
                <Button
                  as={Link}
                  to={`/transactions/${transaction._id}`}
                  size="xs"
                  variant="outline"
                  colorScheme="blue"
                >
                  View
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      {showViewAll && transactions.length > limit && (
        <Flex justify="center" p={3} borderTopWidth="1px" borderColor={borderColor}>
          <Button as={Link} to="/transactions" size="sm" variant="link" colorScheme="blue">
            View All Transactions
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default TransactionList;