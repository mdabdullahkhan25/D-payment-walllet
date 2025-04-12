import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, CSSReset, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { TransactionProvider } from './contexts/TransactionContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import TransactionDetail from './pages/TransactionDetail';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

// Styles
import './styles/main.scss';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <CSSReset />
      <Router>
        <AuthProvider>
          <WalletProvider>
            <TransactionProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/wallet" 
                    element={
                      <ProtectedRoute>
                        <Wallet />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/transactions" 
                    element={
                      <ProtectedRoute>
                        <Transactions />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/transactions/:id" 
                    element={
                      <ProtectedRoute>
                        <TransactionDetail />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/payment" 
                    element={
                      <ProtectedRoute>
                        <Payment />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </TransactionProvider>
          </WalletProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
