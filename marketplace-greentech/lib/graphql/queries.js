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
    $limit: Int
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
      limit: $limit
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
      }
      category {
        id
        name
        slug
      }
      primaryImage {
        id
        image
        isPrimary
      }
    }
  }
`; 