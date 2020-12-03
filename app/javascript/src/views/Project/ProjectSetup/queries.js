import { gql } from "@apollo/client";

const projectFields = gql`
  fragment ProjectSetupFields on Project {
    id
    isOwner
    status
    goals
    publishedAt
    characteristics
    optionalCharacteristics
    requiredCharacteristics
    likelyToHire
    locationImportance
    industryExperienceImportance
    primarySkill {
      id
      name
      goalPlaceholder
      characteristicPlaceholder
    }
    salesPerson {
      id
      firstName
      name
      image
    }
    user {
      id
      location
      companyType
      industry {
        id
        name
        popularSkills(first: 10) {
          nodes {
            id
            name
          }
        }
      }
      country {
        id
        name
      }
    }
    skills {
      id
      name
    }
  }
`;

export const GET_JOB = gql`
  ${projectFields}

  query getJob($id: ID!) {
    skills(local: true) {
      id
      name
    }

    popularSkills(first: 10) {
      nodes {
        id
        name
      }
    }

    project(id: $id) {
      ...ProjectSetupFields
    }
  }
`;

export const UPDATE_PROJECT = gql`
  ${projectFields}

  mutation updateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      project {
        ...ProjectSetupFields
      }
    }
  }
`;

export const PUBLISH_PROJECT = gql`
  ${projectFields}

  mutation publishProject($input: PublishProjectInput!) {
    publishProject(input: $input) {
      project {
        ...ProjectSetupFields
      }
    }
  }
`;

export const DELETE_JOB = gql`
  mutation deleteJob($input: DeleteJobInput!) {
    deleteJob(input: $input) {
      id
    }
  }
`;
