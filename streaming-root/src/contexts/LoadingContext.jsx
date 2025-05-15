"use client";
import { createContext, useState, useContext, useCallback } from 'react';

const LoadingContext = createContext(undefined);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoadingState] = useState(false);

  // useCallback to stabilize the setIsLoading function reference
  const setIsLoading = useCallback((loading) => {
    setIsLoadingState(loading);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};