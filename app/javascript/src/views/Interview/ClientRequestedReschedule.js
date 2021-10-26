import React from "react";
import { Redirect } from "react-router-dom";
import { theme, Box, Card, Text, Paragraph } from "@advisable/donut";
import useViewer from "../../hooks/useViewer";
import CalendarIllustration from "src/illustrations/zest/calendar";
import BackButton from "src/components/BackButton";

export default function ClientRequestedReschedule({ interview }) {
  const { id } = interview;
  const { isSpecialist } = useViewer();

  if (isSpecialist) {
    return <Redirect to={`/interview_request/${id}`} />;
  }

  return (
    <Box maxWidth="500px" marginX="auto" paddingY="xl">
      <Card padding={["xl", "2xl"]}>
        <Box marginBottom={2}>
          <BackButton to="/hire" />
        </Box>
        <CalendarIllustration width="200px" color={theme.colors.blue200} />
        <Text
          fontSize="3xl"
          fontWeight="medium"
          color="neutral900"
          letterSpacing="-0.02em"
          marginBottom="sm"
        >
          You have requested to reschedule your call with{" "}
          {interview.specialist.firstName}
        </Text>
        <Paragraph>
          We have sent your updated availability to{" "}
          {interview.specialist.firstName}. We will let you know once they have
          scheduled a call for one of these times.
        </Paragraph>
      </Card>
    </Box>
  );
}
