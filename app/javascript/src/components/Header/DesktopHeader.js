import React from "react";
import { StyledHeader, StyledHeaderSpacer } from "./styles";
import CurrentUser from "./CurrentUser";
import { Box } from "@advisable/donut";
import HeaderLogo from "src/components/HeaderLogo";
import useViewer from "src/hooks/useViewer";
import Notifications from "./Notifications";
import Navigation from "./Navigation";
import NavigationLink from "./NavigationLink";

export default function DesktopHeader() {
  const viewer = useViewer();

  return (
    <>
      <StyledHeader>
        <HeaderLogo />
        <Box flexGrow={1}>
          <Navigation />
        </Box>
        <Box display="flex" alignItems="center" css="gap: 12px;">
          {viewer?.isSpecialist && <Notifications />}
          {viewer ? (
            <CurrentUser />
          ) : (
            <NavigationLink to="/login">Login</NavigationLink>
          )}
        </Box>
      </StyledHeader>
      <StyledHeaderSpacer />
    </>
  );
}
