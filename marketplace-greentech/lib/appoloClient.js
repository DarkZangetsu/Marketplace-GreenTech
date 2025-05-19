import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Gestion des erreurs
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql/',
});

// Ajout du token d'authentification aux requêtes
const authLink = setContext((_, { headers }) => {
  // Récupérer le token du localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Retourner les headers avec le token
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  };
});

// Création du client Apollo
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;