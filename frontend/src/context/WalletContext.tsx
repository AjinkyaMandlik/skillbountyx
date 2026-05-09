"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestAccess, setAllowed } from '@stellar/freighter-api';
import api from '../lib/api';

interface User {
  id: string;
  username: string;
  role: string;
  wallet_address: string;
}

interface WalletContextType {
  publicKey: string | null;
  user: User | null;
  connect: (username: string, role: string) => Promise<void>;
  disconnect: () => void;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me')
        .then(res => {
          setUser(res.data.user);
          setPublicKey(res.data.user.wallet_address);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const connect = async (username: string, role: string) => {
    try {
      await setAllowed();
      const access = await requestAccess();
      if (access) {
        setPublicKey(access);
        
        // For MVP, auto-register/login using the public key as password
        try {
          const loginRes = await api.post('/auth/login', {
            email: `${access}@skillbounty.x`,
            password: access
          });
          localStorage.setItem('token', loginRes.data.token);
          setUser(loginRes.data.user);
        } catch (err: any) {
          if (err.response?.status === 400) {
            // Register
            const regRes = await api.post('/auth/register', {
              username,
              email: `${access}@skillbounty.x`,
              password: access,
              wallet_address: access,
              role
            });
            localStorage.setItem('token', regRes.data.token);
            setUser(regRes.data.user);
          } else {
            throw err;
          }
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <WalletContext.Provider value={{ publicKey, user, connect, disconnect, loading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
