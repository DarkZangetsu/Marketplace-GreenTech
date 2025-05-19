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