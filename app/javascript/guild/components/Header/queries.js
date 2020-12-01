import { gql } from "@apollo/client";

export const GUILD_LAST_READ_QUERY = gql`
  {
    viewer {
      ... on Specialist {
        guildUnreadMessages
        guildUnreadNotifications
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation logout($input: LogoutInput!) {
    logout(input: $input) {
      success
    }
  }
`;
