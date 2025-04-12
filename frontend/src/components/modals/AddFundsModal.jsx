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
  useToast,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';
import { useWallet } from '../../contexts/WalletContext';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your own Stripe publishable key
const stripePromise = loadStripe('pk_test_your_stripe_key');

const AddFundsForm = ({ onClose }) => {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addFunds } = useWallet();
  const toast = useToast();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a payment method using the card element
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      // Add funds to wallet
      await addFunds(amount, paymentMethod.id);

      toast({
        title: 'Funds added',
        description: `$${amount} has been added to your wallet.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add funds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4}>
        <FormLabel>Amount</FormLabel>
        <NumberInput min={5} value={amount} onChange={(value) => setAmount(Number(value))}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Card Details</FormLabel>
        <Box p={3} borderWidth="1px" borderRadius="md">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </Box>
      </FormControl>

      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Button
        colorScheme="teal"
        isLoading={loading}
        loadingText="Processing"
        type="submit"
        isDisabled={!stripe}
        width="full"
        mt={2}
      >
        Add Funds
      </Button>
    </form>
  );
};

const AddFundsModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay className="fade-in" />
      <ModalContent className="slide-up">
        <ModalHeader>Add Funds to Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Elements stripe={stripePromise}>
            <AddFundsForm onClose={onClose} />
          </Elements>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFundsModal; 