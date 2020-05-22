import gql from "graphql-tag";

export const SUBMIT_FULL_APPLICATION = gql`
  mutation submitFullApplication($input: SubmitFullApplicationInput!) {
    submitFullApplication(input: $input) {
      specialist {
        id
        applicationStage
      }
    }
  }
`;
