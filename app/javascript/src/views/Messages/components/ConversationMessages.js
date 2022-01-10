import SimpleBar from "simplebar-react";
import { motion } from "framer-motion";
import React, { useRef, useMemo, useEffect } from "react";
import { Box, Stack, Button, useBreakpoint } from "@advisable/donut";
import { useMessages } from "../queries";
import Message from "./Message";
import MessagesLoading from "./MessagesLoading";
import MessageComposer from "./MessageComposer";
import useUpdateConversationLastRead from "../hooks/useUpdateConversationLastRead";
import MessagePrompt from "./MessagePrompt";

// Poll every 5 minutes as fallback if subscriptions fail
const POLL = 300000;

export default function ConversationMessages({ conversation, currentAccount }) {
  const isDesktop = useBreakpoint("lUp");
  useUpdateConversationLastRead(conversation);
  const { data, loading, fetchMore, refetch } = useMessages({
    pollInterval: POLL,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    variables: { id: conversation.id },
  });

  useEffect(() => {
    function handleVisible() {
      if (!isDesktop && document.hidden === false) {
        refetch();
      }
    }

    document.addEventListener("visibilitychange", handleVisible);
  }, [refetch, isDesktop]);

  const scrollRef = useRef(null);
  const hasPreviousMessages =
    data?.conversation?.messages?.pageInfo?.hasPreviousPage;

  const messageEdges = useMemo(() => {
    const edges = data?.conversation?.messages?.edges || [];
    return [...edges].sort((x, y) => {
      return x.node.createdAt - y.node.createdAt;
    });
  }, [data?.conversation?.messages]);

  const lastMessageId = useMemo(() => {
    if (messageEdges.length === 0) return null;
    return messageEdges[messageEdges.length - 1].node.id;
  }, [messageEdges]);

  useEffect(() => {
    const simpleBar = scrollRef.current;
    if (!simpleBar) return;
    const scrollView = simpleBar.getScrollElement();
    scrollView.scrollTop = scrollView.scrollHeight;
  }, [lastMessageId, scrollRef]);

  const loadMore = () => {
    fetchMore({
      variables: {
        conversation: conversation.id,
        cursor: data.conversation.messages.pageInfo.startCursor,
      },
    });
  };

  const isLoading = !data && loading;

  return (
    <MessagePrompt simplebar={scrollRef}>
      <SimpleBar ref={scrollRef} style={{ height: "100%" }}>
        <Box maxWidth="700px" mx="auto" px={4}>
          {isLoading && <MessagesLoading />}
          {!isLoading && (
            <Box
              as={motion.div}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            >
              {hasPreviousMessages && (
                <Box display="flex" alignItems="center" paddingTop={8}>
                  <Box
                    flexShrink={1}
                    height="1px"
                    width="100%"
                    bg="neutral200"
                  />
                  <Box flexShrink={0} px={4}>
                    <Button
                      loading={loading}
                      onClick={loadMore}
                      variant="dark"
                      size="xs"
                    >
                      Load previous messages
                    </Button>
                  </Box>
                  <Box
                    flexShrink={1}
                    height="1px"
                    width="100%"
                    bg="neutral200"
                  />
                </Box>
              )}
              <Box paddingY={8}>
                <Stack spacing={6} id="messages" paddingBottom={6}>
                  {messageEdges.map((edge) => (
                    <Message key={edge.node.id} message={edge.node} />
                  ))}
                </Stack>
                <MessageComposer
                  conversation={conversation}
                  currentAccount={currentAccount}
                />
              </Box>
            </Box>
          )}
        </Box>
      </SimpleBar>
    </MessagePrompt>
  );
}
