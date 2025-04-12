import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  useToast,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';
import { useWallet } from '../../contexts/WalletContext';

const TransferModal = ({ isOpen, onClose }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState(10);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { wallet, transferFunds } = useWallet();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipientEmail || !amount) {
      setError('Please provide recipient email and amount');
      return;
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (wallet && amount > wallet.balance) {
      setError('Insufficient funds in your wallet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await transferFunds({
        recipientEmail,
        amount,
        description,
      });

      toast({
        title: 'Transfer successful',
        description: `${amount} ${wallet?.currency || 'USD'} has been sent to ${recipientEmail}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setRecipientEmail('');
      setAmount(10);
      setDescription('');
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to transfer funds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay className="fade-in" />
      <ModalContent className="slide-up">
        <ModalHeader>Transfer Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="transfer-form" onSubmit={handleSubmit}>
            {wallet && (
              <Text mb={4} fontSize="sm" color="gray.500">
                Available balance: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: wallet.currency || 'USD',
                }).format(wallet.balance)}
              </Text>
            )}
            
            <FormControl mb={4} isRequired>
              <FormLabel>Recipient Email</FormLabel>
              <Input
                placeholder="Email address of recipient"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                type="email"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Amount</FormLabel>
              <NumberInput 
                min={1} 
                max={wallet?.balance || 1000}
                value={amount} 
                onChange={(value) => setAmount(Number(value))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Description (Optional)</FormLabel>
              <Textarea
                placeholder="Add a note about this transfer"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="sm"
              />
            </FormControl>

            {error && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            form="transfer-form"
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Processing"
          >
            Transfer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransferModal; 