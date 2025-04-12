import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  useColorModeValue,
  FormErrorMessage,
  SimpleGrid,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftElement,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { FiCreditCard, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

const merchants = [
  { id: '1', name: 'Acme Store', category: 'Retail' },
  { id: '2', name: 'Quick Mart', category: 'Groceries' },
  { id: '3', name: 'Foodie Delivery', category: 'Restaurant' },
  { id: '4', name: 'Tech Gadgets', category: 'Electronics' },
  { id: '5', name: 'Style Hub', category: 'Fashion' },
  { id: '6', name: 'Health Essentials', category: 'Pharmacy' },
];

const Payment = () => {
  const { wallet, makePayment } = useWallet();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [selectedMerchant, setSelectedMerchant] = useState('');
  const [amount, setAmount] = useState(10);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'white');
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedMerchant) {
      newErrors.merchant = 'Please select a merchant';
    }
    
    if (!amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (wallet && amount > wallet.balance && paymentMethod === 'wallet') {
      newErrors.amount = 'Insufficient funds in your wallet';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Find the selected merchant object
    const merchant = merchants.find(m => m.id === selectedMerchant);
    
    try {
      // In a real app, we would actually call the API
      // await makePayment({
      //   merchantId: selectedMerchant,
      //   amount,
      //   description,
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPaymentSuccess(true);
      
      toast({
        title: 'Payment successful',
        description: `Your payment of $${amount} to ${merchant.name} was successful.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form
      setSelectedMerchant('');
      setAmount(10);
      setDescription('');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error.message || 'There was an error processing your payment.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Box>
      <Heading as="h1" size="xl" mb={2} color={headingColor}>
        Make a Payment
      </Heading>
      <Text color="gray.500" mb={6}>
        Pay merchants securely using your wallet or other payment methods
      </Text>
      
      {paymentSuccess ? (
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <Heading as="h2" size="lg" mt={4} mb={2}>
            Payment Successful!
          </Heading>
          <Text>
            Your payment has been processed successfully. Redirecting to dashboard...
          </Text>
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
            <CardBody>
              <Heading size="md" mb={4}>
                Payment Details
              </Heading>
              
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired isInvalid={errors.merchant}>
                    <FormLabel>Select Merchant</FormLabel>
                    <RadioGroup value={selectedMerchant} onChange={setSelectedMerchant}>
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                        {merchants.map(merchant => (
                          <Card 
                            key={merchant.id} 
                            variant="outline" 
                            p={3}
                            cursor="pointer"
                            onClick={() => setSelectedMerchant(merchant.id)}
                            borderColor={selectedMerchant === merchant.id ? 'blue.500' : 'gray.200'}
                            bg={selectedMerchant === merchant.id ? useColorModeValue('blue.50', 'blue.900') : undefined}
                          >
                            <HStack>
                              <Box 
                                p={2} 
                                borderRadius="md" 
                                bg={useColorModeValue('gray.100', 'gray.700')}
                              >
                                <FiShoppingBag />
                              </Box>
                              <Box>
                                <Text fontWeight="medium">{merchant.name}</Text>
                                <Text fontSize="sm" color="gray.500">{merchant.category}</Text>
                              </Box>
                              <Radio value={merchant.id} ml="auto" />
                            </HStack>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </RadioGroup>
                    <FormErrorMessage>{errors.merchant}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={errors.amount}>
                    <FormLabel>Payment Amount</FormLabel>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.500"
                        children={<FiDollarSign />}
                      />
                      <NumberInput
                        min={1}
                        value={amount}
                        onChange={(valueString) => setAmount(parseFloat(valueString))}
                        precision={2}
                        width="100%"
                      >
                        <NumberInputField pl={8} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </InputGroup>
                    <FormErrorMessage>{errors.amount}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Description (Optional)</FormLabel>
                    <Textarea
                      placeholder="Add a note about this payment"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      resize="vertical"
                      rows={3}
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Payment Method</FormLabel>
                    <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                      <VStack align="start" spacing={3}>
                        <Radio value="wallet">
                          <HStack spacing={2}>
                            <FiDollarSign />
                            <Text>Wallet Balance</Text>
                            {wallet && (
                              <Text fontSize="sm" color="gray.500">
                                (Available: {formatCurrency(wallet.balance)})
                              </Text>
                            )}
                          </HStack>
                        </Radio>
                        <Radio value="card">
                          <HStack spacing={2}>
                            <FiCreditCard />
                            <Text>Credit/Debit Card</Text>
                          </HStack>
                        </Radio>
                      </VStack>
                    </RadioGroup>
                  </FormControl>
                  
                  <Button
                    mt={6}
                    colorScheme="blue"
                    size="lg"
                    width="100%"
                    type="submit"
                    isLoading={loading}
                    loadingText="Processing Payment"
                  >
                    Pay Now
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
          
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
            <CardBody>
              <Heading size="md" mb={4}>
                Payment Summary
              </Heading>
              
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between">
                  <Text color="gray.500">Merchant</Text>
                  <Text fontWeight="medium">
                    {selectedMerchant 
                      ? merchants.find(m => m.id === selectedMerchant).name 
                      : 'Not selected'}
                  </Text>
                </Flex>
                
                <Flex justify="space-between">
                  <Text color="gray.500">Amount</Text>
                  <Text fontWeight="medium">{formatCurrency(amount)}</Text>
                </Flex>
                
                <Flex justify="space-between">
                  <Text color="gray.500">Payment Method</Text>
                  <Text fontWeight="medium" textTransform="capitalize">{paymentMethod}</Text>
                </Flex>
                
                {description && (
                  <Box>
                    <Text color="gray.500" mb={1}>Description</Text>
                    <Text>{description}</Text>
                  </Box>
                )}
                
                <Divider my={2} />
                
                <Flex justify="space-between" fontWeight="bold">
                  <Text>Total</Text>
                  <Text color="blue.500">{formatCurrency(amount)}</Text>
                </Flex>
                
                <Box bg={useColorModeValue('gray.50', 'gray.700')} p={4} borderRadius="md" mt={4}>
                  <Text fontWeight="medium" mb={2}>Transaction Security</Text>
                  <Text fontSize="sm" color="gray.500">
                    All payments are secured with end-to-end encryption. Your financial information is never stored on our servers.
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Payment; 