import React from "react";
import { DateTime } from "luxon";
import { Link, useLocation } from "react-router-dom";
import { Box, Card, Button, Text, theme } from "@advisable/donut";
import useViewer from "../../hooks/useViewer";
import CalendarIllustration from "src/illustrations/zest/calendar";
import BackButton from "src/components/BackButton";

export default function CallScheduled({ interview }) {
  const viewer = useViewer();
  const isSpecialist = viewer.isSpecialist;
  const location = useLocation();
  const { back } = location.state || {};
  const datetime = DateTime.fromISO(interview.startsAt).toFormat(
    "cccc, dd LLLL y 'at' hh:mm a",
  );
  const recipient = isSpecialist
    ? interview.user.firstName
    : interview.specialist.firstName;

  return (
    <Box maxWidth="500px" marginX="auto" paddingY="4xl">
      <Card padding={["xl", "2xl"]} borderRadius="20px">
        <Box>
          <BackButton to={!back && "/messages"} marginBottom={2} />
          <Box marginBottom="xl">
            <CalendarIllustration width="200px" color={theme.colors.blue200} />
            <Text fontSize="xl" lineHeight="xl">
              Your interview with {recipient} is scheduled to take place on{" "}
              {datetime}
            </Text>
          </Box>
          <Box marginBottom={4}>
            <Link to={`/interviews/${interview.id}/reschedule`}>
              <Button as="span" variant="dark">
                Request To Reschedule
              </Button>
            </Link>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
