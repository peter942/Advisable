import { ApolloClient, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { InMemoryCache } from "@apollo/client";

const createCache = () => {
  return new InMemoryCache({
    possibleTypes: {},
  });
};

const authLink = setContext((_, { headers }) => {
  const csrfElement = document.querySelector("meta[name=csrf-token]");
  const csrf = csrfElement?.getAttribute("content");

  return {
    headers: {
      ...headers,
      "X-CSRF-Token": csrf,
    },
  };
});

const httpLink = createHttpLink({
  uri: "/toby_graphql",
});

const client = new ApolloClient({
  cache: createCache(),
  link: authLink.concat(httpLink),
  defaultOptions: {
    mutate: {
      errorPolicy: "all",
    },
    watchQuery: {
      errorPolicy: "all",
    },
  },
});

export default client;
