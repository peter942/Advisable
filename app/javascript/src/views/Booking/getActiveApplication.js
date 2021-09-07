import { gql } from "@apollo/client";
import { taskFields } from "../../graphql/fragments/tasks";
import { specialistFields } from "../../graphql/fragments/specialists";
import { applicationFields } from "../../graphql/fragments/applications";

export default gql`
  query application($id: ID!) {
    viewer {
      ... on User {
        id
        projectPaymentMethod
      }
    }
    application(id: $id) {
      ...applicationFields
      tasks {
        ...taskFields
      }
      project {
        id
        currency
        isOwner
        primarySkill {
          id
          name
        }
        user {
          id
          companyName
        }
      }
      specialist {
        email
        account {
          id
          firstName
        }
        ...specialistFields
      }
    }
  }

  ${taskFields}
  ${specialistFields}
  ${applicationFields}
`;
