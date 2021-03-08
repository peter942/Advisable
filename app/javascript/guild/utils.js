import { DateTime } from "luxon";

export const lowerDashed = (str) => str.replace(/\s+/g, "-").toLowerCase();

export function timestamp(date) {
  const asLuxon = DateTime.fromJSDate(date);
  return asLuxon.toFormat("dd LLL");
}

export const relativeDate = (date) => {
  const asLuxon = DateTime.fromISO(date);
  return asLuxon.toRelative();
};

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/*
    https://www.apollographql.com/docs/react/data/pagination/#cursor-based
    https://graphql-ruby.org/pagination/using_connections.html
  */
export const cursorLoadMore = ({ fetchMore, collectionKey, data }) => {
  if (!data?.[collectionKey]?.nodes) return;
  const collection = data[collectionKey];

  fetchMore({
    variables: {
      cursor: collection?.pageInfo.endCursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newNodes = fetchMoreResult[collectionKey].nodes;
      const { pageInfo, guildTopic } = fetchMoreResult[collectionKey];

      return newNodes.length
        ? {
            [collectionKey]: {
              __typename: previousResult[collectionKey].__typename,
              nodes: [...previousResult[collectionKey].nodes, ...newNodes],
              pageInfo,
              guildTopic,
            },
          }
        : previousResult;
    },
  });
};

export const isGuildPath = /^\/guild/.test(window.location.pathname);

export const guildPostUrl = (postId) => {
  const fullGuildPath = `/guild/posts/${postId}`;
  return isGuildPath ? `/posts/${postId}` : fullGuildPath;
};

export const hasGqlError = (code, errors) =>
  errors?.graphQLErrors?.[0]?.extensions?.code === code;

export const loginWithRedirectPath = (path) => {
  const redirect = encodeURIComponent(`/guild${path}`);
  window.location = `/login?redirect=${redirect}`;
};
