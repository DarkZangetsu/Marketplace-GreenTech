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


export const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      success
    }
  }
`;

export const CHANGE_LISTING_STATUS = gql`
  mutation ChangeListingStatus($id: ID!, $status: String!) {
    changeListingStatus(id: $id, status: $status) {
      success
      listing {
        id
        status
      }
    }
  }
`;

export const UPDATE_LISTING = gql`
  mutation UpdateListing($id: ID!, $input: ListingInput!) {
    updateListing(id: $id, input: $input) {
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
          lastName
        }
        category {
          id
          name
        }
        images {
          id
          image
          createdAt
          isPrimary
        }
      }
    }
  }
`;

// Mutation pour envoyer un message
export const SEND_MESSAGE = gql`
  mutation SendMessage($listingId: ID!, $message: String!, $receiverId: ID!) {
    sendMessage(listingId: $listingId, message: $message, receiverId: $receiverId) {
      messageObj {
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
        listing {
          id
          title
          description
          images {
            id
            image
            isPrimary
            createdAt
          }
        }
      }
    }
  }
`;

// Mutation pour marquer un message comme lu
export const MARK_MESSAGE_AS_READ = gql`
  mutation MarkMessageAsRead($messageId: ID!) {
    markMessageAsRead(messageId: $messageId) {
      message {
        id
        message
        isRead
        createdAt
      }
    }
  }
`;
