'use client'
import { ApolloProvider } from '@apollo/client';
import client from '../../lib/appoloClient'; 

export function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
} 