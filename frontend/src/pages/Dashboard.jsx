import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FiArrowUpRight, FiArrowDownLeft, FiRepeat, FiCreditCard } from 'react-icons/fi';
import WalletCard from '../components/WalletCard';
import TransactionList from '../components/TransactionList';
import { useTransaction } from '../contexts/TransactionContext';
import { useAuth } from '../contexts/AuthContext';

const StatCard = ({ title, value, icon, color, helperText, isIncrease }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box 
      p={5} 
      bg={bg} 
      borderRadius="lg" 
      boxShadow="sm" 
      borderWidth="1px" 
      borderColor={borderColor}
      className="card-hover"
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" color="gray.500">{title}</Text>
          <Text fontSize="2xl" fontWeight="bold" mt={1}>
            {value}
          </Text>
          {helperText && (
            <StatHelpText mt={1}>
              {isIncrease !== undefined && (
                <StatArrow type={isIncrease ? 'increase' : 'decrease'} />
              )}
              {helperText}
            </StatHelpText>
          )}
        </Box>
        <Flex
          w="40px"
          h="40px"
          align="center"
          justify="center"
          borderRadius="full"
          bg={`${color}.100`}
          color={`${color}.500`}
        >
          <Icon as={icon} boxSize={5} />
        </Flex>
      </Flex>
    </Box>
  );
};

const Dashboard = () => {
  const { summary, fetchTransactionSummary, loading: transactionLoading } = useTransaction();
  const { user } = useAuth();
  const headingColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    fetchTransactionSummary();
  }, [fetchTransactionSummary]);

  const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box>
      <Flex direction="column" mb={6}>
        <Heading as="h1" size="xl" color={headingColor}>
          Dashboard
        </Heading>
        <Text color="gray.500" mt={1}>
          Welcome back, {user?.name || 'User'}!
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

      {summary && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
          <StatCard
            title="Total Transactions"
            value={summary.totalTransactions}
            icon={FiRepeat}
            color="blue"
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(summary.totalSpent)}
            icon={FiArrowUpRight}
            color="red"
          />
          <StatCard
            title="Total Received"
            value={formatCurrency(summary.totalReceived)}
            icon={FiArrowDownLeft}
            color="green"
          />
          <StatCard
            title="Net Balance"
            value={formatCurrency(summary.totalReceived - summary.totalSpent)}
            icon={FiCreditCard}
            color="purple"
            helperText={summary.totalReceived > summary.totalSpent ? 'Income exceeds spending' : 'Spending exceeds income'}
            isIncrease={summary.totalReceived > summary.totalSpent}
          />
        </SimpleGrid>
      )}

      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h2" size="md" color={headingColor}>
            Recent Transactions
          </Heading>
        </Flex>
        <TransactionList limit={5} showViewAll={true} />
      </Box>
    </Box>
  );
};

export default Dashboard; 