import React, { useState } from "react";
import { Home, Chat } from "@styled-icons/heroicons-solid";
import { useQuery } from "@apollo/client";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Box, useBreakpoint } from "@advisable/donut";
import logo from "@advisable-main/components/Header/logo.svg";
import CurrentUser from "./CurrentUser";
import MobileNavigation from "./MobileNavigation";
import useViewer from "src/hooks/useViewer";
import GuildToggle from "src/components/GuildToggle";
import {
  StyledHeader,
  StyledHeaderLink,
  StyledHeaderBadge,
  StyledHamburger,
} from "./styles";
import { GUILD_LAST_READ_QUERY } from "./queries";
import Notifications from "./Notifications";
import useUnreadCount from "../../hooks/twilioChat/useUnreadCount";

const TWO_MINUTES = 120000;

const Header = () => {
  const viewer = useViewer();
  const location = useLocation();
  const isLargeScreen = useBreakpoint("mUp");
  const unreadMessages = useUnreadCount();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const path = encodeURIComponent(`/guild${location.pathname}`);

  const { data: lastReadData } = useQuery(GUILD_LAST_READ_QUERY, {
    pollInterval: TWO_MINUTES,
    skip: !viewer,
  });

  const hasUnreadNotifications = lastReadData?.viewer?.guildUnreadNotifications;

  return (
    <>
      <StyledHeader px="lg">
        <Box display="flex" alignItems="center">
          <Box display={{ _: "block", m: "none" }}>
            <StyledHamburger onClick={() => setMobileNavOpen(true)}>
              <div />
              <div />
              <div />
            </StyledHamburger>
          </Box>

          <Box mt="-2px" mr={8}>
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </Box>

          <MobileNavigation
            mobileNavOpen={mobileNavOpen}
            setMobileNavOpen={setMobileNavOpen}
          />

          {viewer ? (
            <Box as="nav" display={{ _: "none", m: "block" }}>
              <StyledHeaderLink as={NavLink} to="/feed">
                <Home />
                Feed
              </StyledHeaderLink>
              <StyledHeaderLink as={NavLink} to="/messages">
                <Chat />
                {unreadMessages ? (
                  <StyledHeaderBadge top="4px" left="32px" />
                ) : null}
                Messages
              </StyledHeaderLink>
            </Box>
          ) : null}
        </Box>

        <Box display="flex" alignItems="center">
          {viewer && isLargeScreen ? (
            <GuildToggle mr={4} url="/">
              Switch to projects
            </GuildToggle>
          ) : null}
          {viewer ? (
            <Box mr={4}>
              <Notifications hasUnread={hasUnreadNotifications} />
            </Box>
          ) : (
            <StyledHeaderLink as="a" href={`/login?redirect=${path}`}>
              Login
            </StyledHeaderLink>
          )}
          <CurrentUser />
        </Box>
      </StyledHeader>
      <Box height="58px" />
      {/* <Mask isOpen={maskOpen} toggler={safeToggleMask} /> */}
    </>
  );
};

export default Header;
