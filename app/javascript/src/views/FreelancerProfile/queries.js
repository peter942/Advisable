import { gql } from "@apollo/client";

const fields = gql`
  fragment SpecialistFields on Specialist {
    id
    name
    firstName
    avatar
    coverPhoto
    location
    bio
    linkedin
    website
    city
    country {
      id
    }

    projectSkills {
      nodes {
        id
        name
      }
    }

    industries {
      id
      name
    }

    profileProjects {
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
      reviews {
        id
        name
        role
        comment
        companyName
      }
    }

    reviews {
      id
      name
      role
      comment
      companyName
      avatar
    }
  }
`;

export const GET_PROFILE = gql`
  ${fields}
  query getProfileData($id: ID!) {
    specialist(id: $id) {
      ...SpecialistFields
    }
  }
`;

export const GET_COUNTRIES = gql`
  query getCountries {
    countries {
      value: id
      label: name
    }
  }
`;

export const UPDATE_PROFILE = gql`
  ${fields}
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      specialist {
        ...SpecialistFields
      }
    }
  }
`;

export const updateProfileOptimisticResponse = (specialist, values) => {
  return {
    __typename: "Mutation",
    updateProfile: {
      __typename: "UpdateProfilePayload",
      specialist: {
        __typename: "Specialist",
        ...specialist,
        ...values,
        country: {
          __typename: "Country",
          id: values.country,
        },
      },
    },
  };
};

export const SET_COVER_PHOTO = gql`
  ${fields}
  mutation SetCoverPhoto($input: SetCoverPhotoInput!) {
    setCoverPhoto(input: $input) {
      specialist {
        ...SpecialistFields
      }
    }
  }
`;
