import React from "react";
import { AlertCircle } from "@styled-icons/feather";
import { Box, Text } from "@advisable/donut";
import CopyURL from "../CopyURL";

const ProjectValidationPrompt = ({ project }) => {
  let name = project.contactFirstName;
  if (project.contactLastName) name += ` ${project.contactLastName}`;

  return (
    <Box borderRadius={12} bg="orange50" padding="s">
      <Box display="flex">
        <Box color="orange800" pt={0.5}>
          <AlertCircle size={32} strokeWidth={1.25} />
        </Box>
        <Box ml="xs">
          <Text
            fontSize="s"
            fontWeight="medium"
            lineHeight="m"
            color="neutral900"
          >
            Verification required
          </Text>
          <Text fontSize="xs" color="neutral800" mb="s">
            Please send the following verification URL to {name} from{" "}
            {project.clientName} so they can verify the project.
          </Text>
        </Box>
      </Box>
      <CopyURL bg="white">{`${location.origin}/verify_project/${project.id}`}</CopyURL>
    </Box>
  );
};

export default ProjectValidationPrompt;
