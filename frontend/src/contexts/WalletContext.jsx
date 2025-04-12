import React, { createContext, useState, useEffect, useContext } from 'react';
import { walletService } from '../services/api';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWallet = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.getWallet();
      setWallet(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch wallet data');
      console.error('Error fetching wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWallet();
    }
  }, [isAuthenticated]);

  const addFunds = async (amount, paymentMethodId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.addFunds(amount, paymentMethodId);
      setWallet(response.data.wallet);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add funds');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferFunds = async (transferData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.transferFunds(transferData);
      setWallet(response.data.senderWallet);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to transfer funds');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await walletService.makePayment(paymentData);
      setWallet(response.data.wallet);
      return response.data;
    } catch (err) {
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    wallet,
    loading,
    error,
    fetchWallet,
    addFunds,
    transferFunds,
    makePayment,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletContext; 