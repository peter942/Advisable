import React from "react";
import { Link, Box } from "@advisable/donut";
import AdvisableLogo from "src/components/Logo";

export default function Header() {
  return (
    <Box gridArea="header" alignSelf="end">
      <Link.External href="https://advisable.com/">
        <AdvisableLogo color="blue500" />
      </Link.External>
    </Box>
  );
}
