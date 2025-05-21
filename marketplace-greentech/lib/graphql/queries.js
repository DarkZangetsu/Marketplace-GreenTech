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