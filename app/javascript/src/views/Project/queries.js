import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";

const applicationDetails = gql`
  fragment ApplicationDetails on Application {
    id
    rate
    comment
    score
    status
    appliedAt
    introduction
    availability
    proposalComment
    questions {
      question
      answer
    }
    previousProjects {
      id
      title
      clientName
      coverPhoto {
        url
      }
      excerpt
      primaryIndustry {
        id
        name
        color
      }
      primarySkill {
        id
        name
      }
      skills {
        id
        name
      }
      industries {
        id
        name
      }
    }
    specialist {
      id
      name
      email
      firstName
      avatar
      location
      reviews {
        id
        name
        role
        avatar
        companyName
        comment
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query project($id: ID!) {
    project(id: $id) {
      id
      status
      viewerCanAccess
      user {
        id
        availability
        salesPerson {
          id
          name
          image
          firstName
        }
      }
      primarySkill {
        id
        name
      }
    }
  }
`;

export const GET_CANDIDATES = gql`
  query getCandidates($id: ID!) {
    project(id: $id) {
      id
      candidates: applications(
        status: [
          "Application Accepted"
          "Interview Scheduled"
          "Interview Completed"
          "Proposed"
        ]
      ) {
        id
        rate
        score
        status
        availability
        interview {
          id
          startsAt
        }
        specialist {
          id
          name
          avatar
          location
          firstName
        }
      }
    }
  }
`;

export function useCandidates(opts) {
  return useQuery(GET_CANDIDATES, opts);
}

export const GET_CANDIDATE = gql`
  ${applicationDetails}

  query getCandidate($id: ID!) {
    application(id: $id) {
      ...ApplicationDetails

      interview {
        id
        startsAt
      }
    }
  }
`;

export function useCandidate(opts) {
  return useQuery(GET_CANDIDATE, opts);
}

export const GET_PROPOSAL = gql`
  query getPropposal($id: ID!) {
    application(id: $id) {
      id
      proposedAt
      projectType
      proposalComment
      specialist {
        id
        avatar
        firstName
        name
      }
      tasks {
        id
        name
        dueDate
        estimate
        estimateType
        flexibleEstimate
      }
    }
  }
`;

export function useProposal(opts) {
  return useQuery(GET_PROPOSAL, opts);
}

export const GET_MATCHES = gql`
  ${applicationDetails}

  query getMatches($id: ID!) {
    viewer {
      ... on User {
        id
        walkthroughComplete: hasCompletedTutorial(tutorial: "RECOMMENDATIONS")
      }
    }
    project(id: $id) {
      id
      sourcing
      user {
        id
      }
      accepted: applications(
        status: [
          "Application Accepted"
          "Interview Scheduled"
          "Interview Completed"
          "Proposed"
        ]
      ) {
        id
        specialist {
          id
          avatar
          name
        }
      }
      matches: applications(status: ["Applied"]) {
        ...ApplicationDetails
      }
    }
  }
`;

export const REQUEST_INTRODUCTION = gql`
  mutation requestIntroduction($input: RequestIntroductionInput!) {
    requestIntroduction(input: $input) {
      application {
        id
        status
      }
      interview {
        id
        user {
          id
          availability
        }
      }
    }
  }
`;

export function useRequestIntroduction(application, opts) {
  const params = useParams();
  const client = useApolloClient();
  const projectId = params.id;

  return useMutation(REQUEST_INTRODUCTION, {
    ...opts,
    refetchQueries: [
      {
        query: GET_CANDIDATES,
        variables: {
          id: projectId,
        },
      },
    ],
    update() {
      opts.update();
      // First update the inbox queries
      const data = client.readQuery({
        query: GET_MATCHES,
        variables: {
          id: projectId,
        },
      });

      const isLastApplication = data.project.matches.length === 1;

      client.writeQuery({
        query: GET_MATCHES,
        variables: {
          id: projectId,
        },
        data: {
          ...data,
          project: {
            ...data.project,
            sourcing: isLastApplication ? false : true,
            accepted: [...data.project.accepted, application],
            matches: data.project.matches.filter((app) => {
              return app.id !== application.id;
            }),
          },
        },
      });
    },
  });
}

export function useRejectCacheUpdate(application) {
  const params = useParams();
  const client = useApolloClient();
  const projectId = params.id;

  return function rejectApplicationCacheUpdate() {
    // Apollo annoyingly throws an error when readQuery is called with a query
    // that is not in the cache.
    // The user may be rejected a candidate from the view accepted candidate
    // page in which case the matches query wont be in the apollo cache and so
    // we need to wrap in a try catch.
    try {
      const data = client.readQuery({
        query: GET_MATCHES,
        variables: {
          id: projectId,
        },
      });

      const isLastApplication = data.project.matches.length === 1;
      const hasRequestedIntroductions = data.project.accepted.length > 0;
      client.writeQuery({
        query: GET_MATCHES,
        variables: {
          id: projectId,
        },
        data: {
          ...data,
          project: {
            ...data.project,
            sourcing: !(isLastApplication && hasRequestedIntroductions),
            matches: data.project.matches.filter((app) => {
              return app.id !== application.id;
            }),
          },
        },
      });
    } catch (_) {
      // Cache isnt populated
    }

    // The user may be rejecting the candidate by going straight to the detail
    // view in which case the candidates query wont be in the cache and so we
    // need to use try catch to rescue from apollo throwing error on readQuery
    try {
      const data = client.readQuery({
        query: GET_CANDIDATES,
        variables: {
          id: projectId,
        },
      });

      client.writeQuery({
        query: GET_CANDIDATES,
        variables: {
          id: projectId,
        },
        data: {
          ...data,
          project: {
            ...data.project,
            candidates: data.project.candidates.filter((app) => {
              return app.id !== application.id;
            }),
          },
        },
      });
    } catch (_) {
      // cache isnt populated
    }
  };
}

export const GET_AVAILABILITY = gql`
  query getAvailability {
    viewer {
      ... on User {
        id
        availability
        interviews(status: "Call Scheduled") {
          id
          startsAt
          specialist {
            id
            firstName
          }
        }
      }
    }
  }
`;

export function useAvailability(opts) {
  return useQuery(GET_AVAILABILITY, opts);
}

export const GET_TASK = gql`
  query getTask($id: ID!) {
    task(id: $id) {
      id
      name
      dueDate
      estimate
      description
      estimateType
      flexibleEstimate
    }
  }
`;

export function useTask(opts) {
  return useQuery(GET_TASK, opts);
}

export const COMPLETE_TUTORIAL = gql`
  mutation completeTutorial($input: CompleteTutorialInput!) {
    completeTutorial(input: $input) {
      viewer {
        ... on User {
          id
          walkthroughComplete: hasCompletedTutorial(tutorial: "RECOMMENDATIONS")
        }
      }
    }
  }
`;

export function useCompleteTutorial(opts) {
  return useMutation(COMPLETE_TUTORIAL, opts);
}

export const TOGGLE_SOURCING = gql`
  mutation toggleSourcing($input: ToggleSourcingInput!) {
    toggleSourcing(input: $input) {
      project {
        id
        sourcing
      }
    }
  }
`;

export function useToggleSourcing(opts) {
  return useMutation(TOGGLE_SOURCING, opts);
}

const projectFields = gql`
  fragment ProjectFields on Project {
    id
    isOwner
    goals
    locationImportance
    industryExperienceImportance
    characteristics
    requiredCharacteristics
    optionalCharacteristics
    primarySkill {
      id
      name
      goalPlaceholder
      characteristicPlaceholder
    }
    skills {
      id
      name
    }
  }
`;

export const GET_PROJECT_SETTINGS = gql`
  ${projectFields}
  query projectSettings($id: ID!) {
    project(id: $id) {
      ...ProjectFields
      id
      user {
        id
        location
        companyType
        industry {
          id
          name
        }
      }
    }
  }
`;

export function useProjectSettings() {
  const { id } = useParams();
  return useQuery(GET_PROJECT_SETTINGS, {
    variables: { id },
  });
}

export const UPDATE_PROJECT = gql`
  ${projectFields}

  mutation updateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      project {
        ...ProjectFields
      }
    }
  }
`;

export function useUpdateProject(opts) {
  return useMutation(UPDATE_PROJECT, opts);
}
