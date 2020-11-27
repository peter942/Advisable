import { gql } from "@apollo/client";

export const viewerFields = gql`
  fragment ViewerFields on ViewerUnion {
    ... on User {
      id
      email
      name
      isAdmin
      isTeamManager
      airtableId
      firstName
      lastName
      confirmed
      createdAt
      companyName
      talkSignature
      completedTutorials
      country {
        id
        name
      }
    }
    ... on Specialist {
      id
      email
      name
      createdAt
      airtableId
      firstName
      lastName
      confirmed
      talkSignature
      applicationStage
      completedTutorials
      avatar
      guild
      guildCalendlyLink
      image {
        url
      }
    }
  }
`;

export default gql`
  ${viewerFields}

  query viewer {
    viewer {
      ...ViewerFields
    }
  }
`;
