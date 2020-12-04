import React from "react";
import { useQuery } from "@apollo/client";
import { Box, Avatar, Text, Link } from "@advisable/donut";
import Loading from "@advisable-main/components/Loading";
import { flex } from "@guild/styles";
import { StyledConversationItem } from "../styles";
import { CHAT_PARTICIPANT_QUERY } from "../queries";

const ConversationItem = ({ conversation, setActive, isActive }) => {
  const { data, loading } = useQuery(CHAT_PARTICIPANT_QUERY, {
    variables: { id: conversation?.other },
  });
  const other = data?.specialist;

  if (loading) return <Loading />;
  return (
    <StyledConversationItem
      onClick={() => setActive(conversation.sid)}
      active={isActive}
    >
      <Box alignItems="center" display="flex">
        <Box flexShrink={0}>
          <Avatar
            as={Link}
            size={"s"}
            name={other.name}
            url={other.avatar}
            to={`/freelancers/${other.id}`}
          />
        </Box>
        <Box flexGrow="1" ml={2} css={flex.flexTruncate}>
          <Box
            mb={1}
            display="flex"
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <Text color="neutral900" fontWeight="medium">
              {other.name}
            </Text>
            <Text size="xxs" color="darkGray">
              {conversation.lastMessageWords}
            </Text>
          </Box>
          <Text size="sm" color="neutral600" css={flex.flexTruncate}>
            {conversation.friendlyName}
          </Text>
        </Box>
      </Box>
    </StyledConversationItem>
  );
};

export default ConversationItem;
