import { gql } from "@apollo/client";
import taskFields from "./task";

export default gql`
  ${taskFields}

  fragment TaskDetailFields on Task {
    ...TaskFields
    application {
      id
      rate
      status
      projectType
      trialProgram
      specialist {
        id
        firstName
      }
      trialTask {
        id
        stage
        name
      }
      project {
        id
        currency
        user {
          id
          companyName
        }
      }
    }
  }
`;
