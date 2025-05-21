import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
    $phoneNumber: String
  ) {
    register(
      username: $username
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
    ) {
      success
      message
      user {
        id
        username
        email
        firstName
        lastName
        phoneNumber
      }
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String, $email: String, $password: String!) {
    login(username: $username, email: $email, password: $password) {
      success
      message
      user {
        id
        username
        email
        firstName
        lastName
        phoneNumber
      }
      token
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UserProfileInput!) {
    updateUserProfile(input: $input) {
      success
      message
      user {
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
  }
`;

export const CREATE_LISTING = gql`
  mutation CreateListing($input: ListingInput!) {
    createListing(input: $input) {
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
      }
    }
  }
`;

export const UPLOAD_LISTING_IMAGE = gql`
  mutation UploadListingImage($listingId: ID!, $image: Upload!, $isPrimary: Boolean) {
    uploadListingImage(listingId: $listingId, image: $image, isPrimary: $isPrimary) {
      success
      listingImage {
        id
        image
        isPrimary
      }
      errors
    }
  }
`;