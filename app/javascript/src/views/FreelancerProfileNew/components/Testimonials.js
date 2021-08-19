import React from "react";
import { Box, Stack } from "@advisable/donut";
import SectionTitle from "./SectionTitle";

export default function CaseStudies() {
  return (
    <Box>
      <SectionTitle>Case Studies</SectionTitle>
      <Stack spacing={6}>
        <Box height="120px" bg="neutral100" borderRadius="12px" />
        <Box height="120px" bg="neutral100" borderRadius="12px" />
        <Box height="120px" bg="neutral100" borderRadius="12px" />
      </Stack>
    </Box>
  );
}
