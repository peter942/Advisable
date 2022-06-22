import { gql, useQuery, useMutation } from "@apollo/client";

const interviewFields = gql`
  fragment InterviewFields on Interview {
    id
    status
    startsAt
    timeZone
    specialist {
      id
      firstName
      lastName
      avatar
      location
    }
    user {
      id
      firstName
    }
  }
`;

export const GET_INTERVIEW = gql`
  ${interviewFields}

  query getInterview($id: ID!) {
    interview(id: $id) {
      ...InterviewFields
    }
  }
`;

export function useInterview(opts = {}) {
  return useQuery(GET_INTERVIEW, opts);
}

export const REQUEST_INTERVEW_RESCHEDULE = gql`
  ${interviewFields}

  mutation requestInterviewReschedule(
    $input: RequestInterviewRescheduleInput!
  ) {
    requestInterviewReschedule(input: $input) {
      interview {
        ...InterviewFields
      }
    }
  }
`;

export function useRequestInterviewReschedule() {
  return useMutation(REQUEST_INTERVEW_RESCHEDULE);
}

export const RESEND_INTERVIEW_REQUEST = gql`
  ${interviewFields}

  mutation resendInterviewRequest($input: ResendInterviewRequestInput!) {
    resendInterviewRequest(input: $input) {
      interview {
        ...InterviewFields
      }
    }
  }
`;

export function useResendInterviewRequest() {
  return useMutation(RESEND_INTERVIEW_REQUEST);
}

export const GET_AVAILABILITY = gql`
  query getAvailability {
    viewer {
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
`;

export function useAvailability(opts) {
  return useQuery(GET_AVAILABILITY, opts);
}

export const UPDATE_AVAILABILITY = gql`
  mutation updateAvailability($input: UpdateAvailabilityInput!) {
    updateAvailability(input: $input) {
      viewer {
        id
        availability
      }
    }
  }
`;

export function useUpdateAvailability(opts) {
  return useMutation(UPDATE_AVAILABILITY, opts);
}
