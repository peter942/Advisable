import { gql } from "@apollo/client";

export const GET_AVAILABILITY = gql`
  query client($id: ID!) {
    user(id: $id) {
      id
      availability
      interviews {
        id
        startsAt
        specialist {
          id
          firstName
        }
      }
    }
  }
`;

export const UPDATE_AVAILABILITY = gql`
  mutation UpdateAvailability($input: UpdateAvailabilityInput!) {
    updateAvailability(input: $input) {
      user {
        id
        availability
      }
    }
  }
`;
