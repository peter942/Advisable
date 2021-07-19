import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

export const FETCH_PROJECTS = gql`
  query ManagePreviousProjects {
    viewer {
      ... on Specialist {
        id
        previousProjects(includeValidationFailed: true, includeDrafts: true) {
          nodes {
            id
            title
            draft
            excerpt
            validationStatus
            contactFirstName
            contactLastName
            clientName
            reviews {
              id
              name
              role
              comment
              ratings {
                overall
                skills
                qualityOfWork
                adherenceToSchedule
                availability
                communication
              }
            }
          }
        }
      }
    }
  }
`;

export const useManagePreviousProjects = () => useQuery(FETCH_PROJECTS);
