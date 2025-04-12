import React, { createContext, useState, useEffect, useContext } from 'react';
import { transactionService } from '../services/api';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const fetchTransactions = async (params = {}) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getTransactions(params);
      setTransactions(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.total,
        pages: response.pagination.pages,
      });
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransaction = async (id) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getTransaction(id);
      setTransaction(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch transaction details');
      console.error('Error fetching transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionSummary = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getTransactionSummary();
      setSummary(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch transaction summary');
      console.error('Error fetching transaction summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchTransactionSummary();
    }
  }, [isAuthenticated]);

  const value = {
    transactions,
    transaction,
    summary,
    loading,
    error,
    pagination,
    fetchTransactions,
    fetchTransaction,
    fetchTransactionSummary,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export default TransactionContext; 