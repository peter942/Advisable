import React from "react";
import { Box, Circle, Text, Icon, theme } from "@advisable/donut";

export default function RecommendationBar({ firstName }) {
  return (
    <Box display="flex" alignItems="center">
      <Circle width="40px" height="40px" bg="blue100" flexShrink="0">
        <Icon icon="zap" strokeWidth={0} fill={theme.colors.blue800} />
      </Circle>
      <Box width="100%" flexShrink={1} px="s">
        <Box maxWidth="500px">
          <Text fontSize="xs" lineHeight="s">
            Because {firstName} is a recommended freelancer, we offer an
            expanded 3-day money-back guarantee with them.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
