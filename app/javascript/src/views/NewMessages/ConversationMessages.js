import React, { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import { Box, Stack, Button } from "@advisable/donut";
import { useMessages, useUpdateLastRead } from "./queries";
import Message from "./Message";

// Poll every 5 minutes as fallback if subscriptions fail
const POLL = 300000;

export default function ConversationMessages({ conversation }) {
  const { data, loading, fetchMore } = useMessages({
    pollInterval: POLL,
    notifyOnNetworkStatusChange: true,
    variables: { id: conversation.id },
  });
  const endOfMessagesRef = useRef(null);
  const [updateLastRead] = useUpdateLastRead(conversation);
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
    if (conversation.unreadMessageCount > 0) {
      updateLastRead();
    }
  }, [conversation.unreadMessageCount, updateLastRead]);

  useLayoutEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
  }, [lastMessageId]);

  const loadMore = () => {
    fetchMore({
      variables: {
        conversation: conversation.id,
        cursor: data.conversation.messages.pageInfo.startCursor,
      },
    });
  };

  return (
    <>
      {hasPreviousMessages && (
        <Box display="flex" alignItems="center" paddingTop={8}>
          <Box flexShrink={1} height="1px" width="100%" bg="neutral200" />
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
          <Box flexShrink={1} height="1px" width="100%" bg="neutral200" />
        </Box>
      )}
      <Stack paddingY={10} spacing="4xl" divider="neutral200">
        {messageEdges.map((edge) => (
          <Message key={edge.node.id} message={edge.node} />
        ))}
      </Stack>
      <div ref={endOfMessagesRef} />
    </>
  );
}
