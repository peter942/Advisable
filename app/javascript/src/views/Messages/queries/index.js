import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { matchPath, useLocation } from "react-router-dom";
import CONVERSATIONS from "./conversations.gql";
import MESSAGES from "./messages.gql";
import SEND_MESSAGE from "./sendMessage.gql";
import UPDATE_LAST_READ from "./updateLastRead.gql";
import RECEIVED_MESSAGE from "./receivedMessage.gql";
import ACCEPT_AGREEMENT from "./acceptAgreement.gql";
import ACCEPT_CONSULTATION from "./acceptConsultation.gql";
import DECLINE_CONSULTATION from "./declineConsultationRequest.gql";

export function useConversations() {
  return useQuery(CONVERSATIONS);
}

export function useMessages(opts) {
  return useQuery(MESSAGES, opts);
}

export function useSendMessage(conversation) {
  const client = useApolloClient();

  return useMutation(SEND_MESSAGE, {
    onCompleted(data) {
      const message = data?.sendMessage?.message;
      if (!message) return;

      client.cache.modify({
        id: client.cache.identify(message),
        fields: {
          status() {
            return "SENT";
          },
        },
      });
    },
    update(cache, response) {
      const message = response.data?.sendMessage?.message;
      if (message) {
        cache.modify({
          id: cache.identify(conversation),
          fields: {
            unreadCount() {
              return 0;
            },
            lastMessage() {
              return message;
            },
            messages(previous) {
              return appendToMessages(previous, message);
            },
          },
        });
      }
    },
  });
}

export function useUpdateLastRead(conversation) {
  return useMutation(UPDATE_LAST_READ, {
    variables: {
      conversation: conversation.id,
    },
    optimisticResponse: {
      updateLastRead: {
        __typename: "UpdateLastReadPayload",
        conversation: {
          ...conversation,
          unreadCount: 0,
        },
      },
    },
  });
}

export async function updateConversationsList(client, conversation) {
  const existing = client.cache.readQuery({ query: CONVERSATIONS });
  if (!existing) return;
  const present = existing.conversations.nodes.find(
    (n) => n.id === conversation.id,
  );
  if (present) return;
  const { data } = await client.query({
    query: CONVERSATIONS,
    fetchPolicy: "network-only",
  });
  client.cache.writeQuery({
    query: CONVERSATIONS,
    data,
  });
}

export function updateConversation(client, location, message) {
  const conversationPath = matchPath(location.pathname, {
    path: "/messages/:id",
  });

  const isViewingConversation =
    document.hasFocus() &&
    conversationPath?.params?.id === message.conversation.id;

  client.cache.modify({
    id: client.cache.identify(message.conversation),
    fields: {
      unreadCount() {
        return isViewingConversation ? 0 : message.conversation.unreadCount;
      },
      lastMessage() {
        return message;
      },
      messages(previous) {
        return appendToMessages(previous, message);
      },
    },
  });
}

export function useReceivedMessage() {
  const location = useLocation();
  return useSubscription(RECEIVED_MESSAGE, {
    onSubscriptionData({ client, subscriptionData }) {
      const message = subscriptionData.data?.receivedMessage?.message;
      updateConversation(client, location, message);
      updateConversationsList(client, message.conversation);
    },
  });
}

export function useDeclineConsultationRequest() {
  return useMutation(DECLINE_CONSULTATION);
}

export function useAcceptConsultationRequest() {
  return useMutation(ACCEPT_CONSULTATION);
}

function appendToMessages(messages, message) {
  const existing = messages.edges.find((e) => e.node.id === message.id);
  if (existing) return messages;

  return {
    ...messages,
    edges: [...messages.edges, { node: message }],
  };
}

export function useAcceptAgreement() {
  return useMutation(ACCEPT_AGREEMENT);
}
