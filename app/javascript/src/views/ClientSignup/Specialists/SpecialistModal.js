import React from "react";
import { get } from "lodash";
import gql from "graphql-tag";
import { useLazyQuery } from "react-apollo";
import { Box, Text } from "@advisable/donut";
import Modal from "../../../components/Modal";
import Avatar from "../../../components/Avatar";
import Loading from "../../../components/Loading";
import Scrollable from "../../../components/Scrollable";
import PreviousProjects from "../../../components/PreviousProjects";
import TagCloud from "./TagCloud";
import SpecialistAttributes from "./SpecialistAttributes";

const GET_DATA = gql`
  query specialist($id: ID!) {
    specialist(id: $id) {
      id
      name
      airtableId
      firstName
      hourlyRate
      avatar
      bio
      location
      hourlyRate
      skills
      previousProjectsCount
      reviewsCount
      ratings {
        overall
      }
      previousProjects {
        project {
          ... on Project {
            id
            airtableId
            description
            primarySkill
            user {
              companyName
            }
          }
          ... on OffPlatformProject {
            id
            airtableId
            description
            primarySkill
            clientName
            confidential
            skills
            industry
            validationStatus
          }
        }
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
`;

const SpecialistModal = ({ isOpen, onClose, specialistId }) => {
  const [getSpecialist, { loading, data, error }] = useLazyQuery(GET_DATA);

  React.useEffect(() => {
    if (isOpen) {
      getSpecialist({
        variables: {
          id: specialistId,
        },
      });
    }
  }, [isOpen, getSpecialist, specialistId]);

  const specialist = get(data, "specialist");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="l">
      <Box overflowY="auto">
        <Scrollable>
          {!specialist ? (
            <Loading />
          ) : (
            <Box>
              <Box padding="l">
                <Box mb="m">
                  <Avatar
                    size="l"
                    name={specialist.name}
                    url={specialist.avatar}
                  />
                </Box>
                <Text
                  color="neutral.9"
                  fontSize="xl"
                  fontWeight="medium"
                  mb="xxs"
                >
                  {specialist.name}
                </Text>
                <Text color="neutral.6" fontSize="xs">
                  {specialist.location}
                </Text>
                <SpecialistAttributes specialist={specialist} />
                <Text fontSize="xs" lineHeight="s" color="neutral.6" mb="m">
                  {specialist.bio}
                </Text>
                <TagCloud tags={specialist.skills} />
              </Box>
              <Text
                as="h4"
                pl="l"
                fontSize="xl"
                color="neutral.8"
                letterSpacing="-0.03rem"
                fontWeight="semibold"
              >
                Previous Projects
              </Text>
              <PreviousProjects
                showValidationStatus={false}
                specialistId={specialist.airtableId}
                previousProjects={specialist.previousProjects}
              />
            </Box>
          )}
        </Scrollable>
      </Box>
    </Modal>
  );
};

export default SpecialistModal;
