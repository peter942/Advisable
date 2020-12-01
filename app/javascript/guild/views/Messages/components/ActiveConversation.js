import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { css } from "styled-components";
import { motion } from "framer-motion";
import { truncate } from "lodash-es";
import { Box, Text, Avatar, Link, Textarea, theme } from "@advisable/donut";
import Loading from "@advisable-main/components/Loading";
import useViewer from "@advisable-main/hooks/useViewer";
import { useTwilioChat } from "@guild/hooks/twilioChat/useTwilioChat";
import { StyledMessage } from "../styles";
import InboxHeader from "../components/InboxHeader";
import { GuildBox, flex } from "@guild/styles";
import { SubmitButton } from "@guild/components/Buttons/styles";
import { relativeDate } from "@guild/utils";
import { ScrollToBottom } from "@guild/components/ScrollToBottom";
import { CHAT_PARTICIPANT_QUERY } from "../queries";

const ActiveConversation = ({ channelSid }) => {
  const viewer = useViewer();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    activeChannel: activeConversation,
    messages,
    initializing,
  } = useTwilioChat({
    channelSid,
  });

  useEffect(() => {
    if (!activeConversation) return;
    const setAllMessagesConsumed = async () =>
      await activeConversation.setAllMessagesConsumed();
    setAllMessagesConsumed();
  }, [activeConversation]);

  /* Get the other participant uid  */
  const other = useMemo(() => {
    if (!activeConversation) return;
    const { members } = activeConversation.attributes;
    return Object.values(members).filter((uid) => uid !== viewer.id)?.[0];
  }, [viewer, activeConversation]);

  const { data } = useQuery(CHAT_PARTICIPANT_QUERY, {
    variables: { id: other },
    skip: !other,
  });
  const otherParticipant = data?.specialist;

  const onSubmitNewMessage = async () => {
    if (!message?.length) return;
    setLoading(true);
    try {
      await activeConversation.sendMessage(message);
    } catch (err) {
      console.log(err);
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  if (initializing) return <Loading />;

  return (
    activeConversation && (
      <>
        <InboxHeader>
          <Text
            fontWeight="medium"
            size="2xl"
            color="catalinaBlue100"
            css={flex.flexTruncate}
          >
            {activeConversation?.attributes?.subject}
          </Text>
        </InboxHeader>

        <GuildBox
          px="l"
          py="s"
          height="100%"
          overflow="scroll"
          spaceChildrenVertical={16}
          css={css`
            border-bottom: 1px solid ${theme.colors.ghostWhite};
          `}
        >
          <Text as={GuildBox} size="xs" color="darkGray" alignSelf="center">
            started {relativeDate(activeConversation?.dateCreated)} ago
          </Text>

          {messages?.map((message, key) => (
            <GuildBox flexShrink={0} key={key} spaceChildrenVertical={4}>
              <StyledMessage
                key={key}
                as={motion.div}
                bg={message.author !== other ? "blue200" : "neutral100"}
                alignSelf={message.author !== other ? "flex-end" : "flex-start"}
                maxWidth={{ _: "100%", m: "90%" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                {message.author === other && (
                  <GuildBox
                    mr="s"
                    flexShrink={0}
                    flexCenterBoth
                    spaceChildrenVertical={4}
                  >
                    <Avatar
                      width={"24px"}
                      as={Link}
                      to={`/freelancers/${other}`}
                      size="s"
                      name={otherParticipant.name}
                      url={otherParticipant.avatar}
                    />
                    <Text size="xs" color="quartz">
                      {truncate(otherParticipant.firstName, { length: 13 })}
                    </Text>
                  </GuildBox>
                )}

                <Box minWidth="0">
                  <Text
                    css={css`
                      white-space: pre-wrap;
                      white-space: pre-line;
                    `}
                  >
                    {message.body}
                  </Text>
                  {message.attributes?.calendly_link && (
                    <Link.External
                      href={message.attributes.calendly_link}
                      rel="noreferrer noopener"
                      target="_blank"
                      color="catalinaBlue100"
                      fontWeight="medium"
                    >
                      Book a call with me
                    </Link.External>
                  )}
                </Box>
              </StyledMessage>

              <Box
                alignSelf={message.author === other ? "flex-start" : "flex-end"}
              >
                <Text
                  as={GuildBox}
                  alignSelf="flex-end"
                  color="darkGray"
                  size="xxs"
                >
                  {relativeDate(message.dateCreated)} ago
                </Text>
              </Box>
            </GuildBox>
          ))}
          <ScrollToBottom />
        </GuildBox>

        {/* New Message */}
        <GuildBox
          marginY="m"
          marginX="l"
          width={"95%"}
          height={"143px"}
          alignSelf="center"
          spaceChildrenVertical={8}
        >
          <Textarea
            minRows="3"
            maxRows="3"
            value={message}
            onChange={({ currentTarget }) => setMessage(currentTarget.value)}
            placeholder="New Message ..."
          ></Textarea>
          <SubmitButton
            size="l"
            type="submit"
            loading={loading}
            onClick={onSubmitNewMessage}
            disabled={loading}
          >
            Send
          </SubmitButton>
        </GuildBox>
      </>
    )
  );
};

export default ActiveConversation;
