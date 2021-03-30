import { gql, useMutation } from "@apollo/client";
import VIEWER from "src/graphql/queries/viewer";
import { viewerFields } from "../../graphql/queries/viewer";

export const LOGIN = gql`
  ${viewerFields}

  mutation Login($input: LoginInput!) {
    login(input: $input) {
      viewer {
        ...ViewerFields
      }
    }
  }
`;

export function useLogin() {
  return useMutation(LOGIN, {
    update(cache, { data, errors }) {
      if (!errors) {
        cache.reset();

        cache.writeQuery({
          query: VIEWER,
          data: {
            viewer: data.login.viewer,
          },
        });
      }
    },
  });
}
