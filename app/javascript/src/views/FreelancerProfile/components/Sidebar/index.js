import React, { useState } from "react";
import css from "@styled-system/css";
import { matchPath, useParams } from "react-router";
import { Map } from "@styled-icons/heroicons-outline/Map";
import useViewer from "src/hooks/useViewer";
import { Box, Text, Link } from "@advisable/donut";
import ProfilePicture from "../ProfilePicture";
import CoverImage from "../CoverImage";
import {
  StyledStickySidebar,
  StyledAvatarWrapper,
  StyledNameWrapper,
  StyledBioWrapper,
  StyledShowMore,
} from "./styles";
import BackButton from "../BackButton";
// CTA button
import EditInfo from "../EditInfo";
import MessageButton from "../MessageButton";
import WorkTogetherButton from "../WorkTogetherButton";
import SocialProfilesIcons from "../SocialProfilesIcons";
// Constant values
import { TRUNCATE_LIMIT } from "../../values";

export default function Sidebar({ data, ...props }) {
  const isArticle = !!matchPath(location.pathname, {
    path: "/freelancers/:id/case_studies/:case_study_id",
  });

  const viewer = useViewer();
  const params = useParams();
  const viewerIsGuild = (viewer?.isSpecialist && viewer?.isAccepted) || false;
  const isOwner = viewer?.id === params.id;
  const { specialist } = data;

  const [isExpanded, setExpanded] = useState(false);
  const bioIsExceed = specialist.bio?.length > TRUNCATE_LIMIT;
  const bio = isExpanded
    ? specialist.bio
    : specialist.bio?.slice(0, TRUNCATE_LIMIT);

  return (
    <Box
      position="relative"
      mt={!isArticle && { _: "-24px", m: "-40px", l: "-108px", xl: "-148px" }}
    >
      <StyledStickySidebar layout={["s", "s", "m", "l"]} {...props}>
        <StyledAvatarWrapper>
          {isArticle ? (
            <Box position="relative">
              <BackButton>Go to profile</BackButton>
              <CoverImage src={specialist.coverPhoto} size="collapse" />
            </Box>
          ) : null}
          <ProfilePicture specialist={specialist} />
        </StyledAvatarWrapper>
        <StyledNameWrapper>
          <Text
            as={isArticle && Link}
            to={`/freelancers/${specialist.id}`}
            fontSize={{ _: "2xl", m: "5xl" }}
            fontWeight={600}
            color="neutral900"
            lineHeight={{ _: "24px", m: "32px" }}
            letterSpacing="-0.028em"
            marginBottom={{ xs: 0.5, m: 1.5 }}
            css={
              isArticle &&
              css({
                "&:hover": {
                  color: "neutral900",
                  textDecoration: "underline",
                },
              })
            }
          >
            {specialist.name}
          </Text>
          <Box display="flex" color="neutral500" alignItems="center">
            <Box flexShrink={0}>
              <Map height="20px" width="20px" />
            </Box>
            <Text
              $truncate
              fontSize={{ _: "s", m: "l" }}
              letterSpacing="-0.016em"
              color="neutral600"
              lineHeight="l"
              marginLeft={1}
            >
              {specialist.location}
            </Text>
          </Box>
        </StyledNameWrapper>
        <StyledBioWrapper>
          <Text
            fontSize={{ _: "m", m: "m" }}
            lineHeight="l"
            color="neutral700"
            marginBottom={7}
          >
            {bio}
            {bioIsExceed ? (
              <StyledShowMore onClick={() => setExpanded((e) => !e)}>
                {isExpanded ? <>see&#32;less</> : <>see&#32;more</>}
              </StyledShowMore>
            ) : null}
          </Text>
          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection={["column", "row", "row", "column"]}
            alignItems={{ _: "center", l: "flex-start" }}
          >
            <Box mb={[4, 0, 0, 10]} width="100%">
              {isOwner ? (
                <EditInfo specialist={specialist}>Edit Info</EditInfo>
              ) : null}
              {!isOwner && !viewerIsGuild ? (
                <WorkTogetherButton id={specialist?.id}>
                  Work together
                </WorkTogetherButton>
              ) : null}
              {!isOwner && viewerIsGuild ? (
                <MessageButton specialist={specialist} />
              ) : null}
            </Box>
            <SocialProfilesIcons specialist={specialist} />
          </Box>
        </StyledBioWrapper>
      </StyledStickySidebar>
    </Box>
  );
}
