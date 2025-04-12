import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  useColorModeValue,
  Select,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Stack,
  Divider,
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationNext,
  PaginationPageGroup,
  PaginationPage,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import TransactionList from '../components/TransactionList';
import { useTransaction } from '../contexts/TransactionContext';

const Transactions = () => {
  const { transactions, loading, pagination, fetchTransactions } = useTransaction();
  const [filters, setFilters] = useState({
    type: '',
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const headingColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    fetchTransactions(filters);
  }, [fetchTransactions, filters]);

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleTypeChange = (e) => {
    setFilters({ ...filters, type: e.target.value, page: 1 });
  };

  const handleLimitChange = (e) => {
    setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, you would add search functionality here
    console.log('Searching for:', searchTerm);
  };

  const handleExportData = () => {
    // In a real application, you would implement export functionality here
    console.log('Exporting transaction data');
  };

  return (
    <Box>
      <Flex direction="column" mb={6}>
        <Heading as="h1" size="xl" color={headingColor}>
          Transaction History
        </Heading>
        <Text color="gray.500" mt={1}>
          View and manage your transaction history
        </Text>
      </Flex>

      <Box mb={6}>
        <Stack 
          direction={{ base: 'column', md: 'row' }} 
          spacing={4} 
          mb={6}
        >
          <form onSubmit={handleSearch} style={{ width: '100%' }}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </form>
          
          <Select 
            placeholder="Transaction Type" 
            value={filters.type} 
            onChange={handleTypeChange}
            icon={<FiFilter />}
            w={{ base: '100%', md: '200px' }}
          >
            <option value="">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="transfer">Transfers</option>
            <option value="payment">Payments</option>
          </Select>
          
          <Select
            placeholder="Limit"
            value={filters.limit}
            onChange={handleLimitChange}
            w={{ base: '100%', md: '120px' }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
          
          <Button 
            leftIcon={<FiDownload />} 
            variant="outline" 
            onClick={handleExportData}
            display={{ base: 'none', md: 'flex' }}
          >
            Export
          </Button>
        </Stack>

        <TransactionList limit={0} showViewAll={false} />

        {pagination && pagination.pages > 1 && (
          <Flex justifyContent="center" mt={4} alignItems="center">
            <Button
              size="sm"
              onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
              isDisabled={filters.page === 1}
              mr={2}
            >
              Previous
            </Button>
            <HStack spacing={1}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={page === filters.page ? 'solid' : 'outline'}
                  colorScheme={page === filters.page ? 'blue' : 'gray'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </HStack>
            <Button
              size="sm"
              onClick={() => handlePageChange(Math.min(pagination.pages, filters.page + 1))}
              isDisabled={filters.page === pagination.pages}
              ml={2}
            >
              Next
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Transactions; 