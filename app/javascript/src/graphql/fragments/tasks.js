import gql from "graphql-tag";

export const taskFields = gql`
  fragment taskFields on Task {
    id
    name
    stage
    trial
    dueDate
    estimate
    finalCost
    flexibleEstimate
    estimateType
    description
    createdAt
    repeat
  }
`;
