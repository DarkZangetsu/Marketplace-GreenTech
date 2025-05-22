import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      firstName
      lastName
      phoneNumber
      profilePicture
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($slug: String!) {
    category(slug: $slug) {
      id
      name
      slug
      createdAt
    }
  }
`;

export const GET_LISTINGS = gql`
  query GetListings(
    $search: String
    $categoryId: ID
    $categorySlug: String
    $condition: String
    $minPrice: Float
    $maxPrice: Float
    $location: String
    $userId: ID
    $status: String
  ) {
    listings(
      search: $search
      categoryId: $categoryId
      categorySlug: $categorySlug
      condition: $condition
      minPrice: $minPrice
      maxPrice: $maxPrice
      location: $location
      userId: $userId
      status: $status
    ) {
      id
      title
      description
      condition
      quantity
      unit
      price
      isFree
      location
      address
      contactMethod
      phoneNumber
      email
      status
      createdAt
      updatedAt
      user {
        id
        username
        firstName
        lastName
        profilePicture
      }
      category {
        id
        name
        slug
      }
      images {
        id
        image
      }
    }
  }
`;

export const GET_LISTING = gql`
  query GetListing($id: ID!) {
    listing(id: $id) {
      id
      title
      description
      condition
      quantity
      unit
      price
      isFree
      location
      address
      contactMethod
      phoneNumber
      email
      status
      createdAt
      updatedAt
      user {
        id
        username
        firstName
        lastName
        profilePicture
        phoneNumber
        email
      }
      category {
        id
        name
        slug
      }
      images {
        id
        image
      }
    }
  }
`;


export const GET_ALL_LISTINGS = gql`
  query GetAllListings {
    listings {
      id
      title
      description
      condition
      quantity
      unit
      price
      isFree
      location
      address
      contactMethod
      phoneNumber
      email
      status
      createdAt
      updatedAt
      userId
      images {
        id
        image
        isPrimary
      }
      category {
        id
        name
        slug
      }
      user {
        id
        username
        firstName
        lastName
      }
    }
  }
`;

export const GET_ALL_MESSAGES = gql`
  query GetAllMessages {
    # Si vous avez une requête pour récupérer tous les messages
    # Sinon, vous devrez peut-être ajuster selon votre schema GraphQL
    messages {
      id
      message
      isRead
      createdAt
      sender {
        id
        username
      }
      receiver {
        id
        username
      }
      listing {
        id
        title
      }
    }
  }
`;

export const GET_LISTINGS_WITH_MESSAGES = gql`
  query GetListingsWithMessages {
    listings {
      id
      title
      userId
      messages {
        id
        message
        isRead
        createdAt
        sender {
          id
          username
        }
        receiver {
          id
          username
        }
      }
    }
  }
`;

// Query pour récupérer les annonces de l'utilisateur connecté
export const MY_LISTINGS = gql`
  query MyListings {
    myListings(status: null) {
      id
      title
      description
      condition
      quantity
      unit
      price
      isFree
      location
      address
      contactMethod
      phoneNumber
      email
      status
      createdAt
      updatedAt
      userId
      category {
        id
        name
        slug
        createdAt
      }
      primaryImage {
        id
        image
        isPrimary
        createdAt
      }
    }
  }
`;


// Query pour récupérer toutes les conversations de l'utilisateur
export const GET_MY_CONVERSATIONS = gql`
  query GetMyConversations {
    myConversations {
      id
      lastMessage {
        id
        message
        isRead
        createdAt
        sender {
          id
          username
          firstName
          lastName
        }
      }
      otherUser {
        id
        username
        firstName
        lastName
        profilePicture
      }
      listing {
        id
        title
        images {
          id
          image
          isPrimary
        }
      }
      unreadCount
    }
  }
`;

// Query pour récupérer une conversation spécifique
export const GET_CONVERSATION = gql`
  query GetConversation($userId: ID!, $listingId: ID!) {
    conversation(userId: $userId, listingId: $listingId) {
      id
      message
      isRead
      createdAt
      listing {
        id
        title
        description
      }
      sender {
        id
        username
        firstName
        lastName
        email
        phoneNumber
        profilePicture
        createdAt
        updatedAt
      }
      receiver {
        id
        username
        firstName
        lastName
        email
        phoneNumber
        profilePicture
        createdAt
        updatedAt
      }
    }
  }
`;

export const MY_MESSAGES = gql`
  query MyMessages {
    myMessages(isRead: null) {
      id
      message
      isRead
      createdAt
      sender {
        id
        username
        firstName
        lastName
        email
        phoneNumber
        profilePicture
        createdAt
        updatedAt
        sentMessages {
          id
          message
          isRead
          createdAt
        }
        receivedMessages {
          id
          message
          isRead
          createdAt
        }
      }
      listing {
        id
        title
        description
        condition
        quantity
        unit
        price
        isFree
        location
        address
        contactMethod
        phoneNumber
        email
        status
        createdAt
        updatedAt
        userId
      }
      receiver {
        id
        username
        firstName
        lastName
        email
        phoneNumber
        profilePicture
        createdAt
        updatedAt
      }
    }
  }
`;