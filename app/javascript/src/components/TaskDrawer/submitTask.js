import gql from "graphql-tag";

export default gql`
  mutation submitTask($input: SubmitTaskInput!) {
    submitTask(input: $input) {
      task {
        id
        stage
        finalCost
      }
      errors {
        code
      }
    }
  }
`;
