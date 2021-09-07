import { gql } from "@apollo/client";
import taskFields from "../../graphql/fragments/task";

export default gql`
  ${taskFields}

  query application($id: ID!) {
    application(id: $id) {
      id
      status
      invoiceRate
      projectType
      monthlyLimit
      trialProgram
      trialTask {
        id
        stage
        name
      }
      project {
        id
        currency
        primarySkill {
          id
          name
        }
        user {
          id
          name
          firstName
          companyName
          account {
            id
            firstName
          }
        }
      }
      specialist {
        id
        firstName
        hasSetupPayments
      }
      tasks {
        ...TaskFields
      }
    }
  }
`;
