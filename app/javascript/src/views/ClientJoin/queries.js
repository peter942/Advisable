import { gql, useMutation } from "@apollo/client";
import viewerFields from "src/graphql/fragments/viewerFields.graphql";
import VIEWER from "src/graphql/queries/getViewer.graphql";

const CREATE_CLIENT_ACCOUNT = gql`
  ${viewerFields}

  mutation CreateClientAccount($input: CreateClientAccountInput!) {
    createClientAccount(input: $input) {
      viewer {
        ...ViewerFields
      }
    }
  }
`;

export const useCreateClientAccount = () =>
  useMutation(CREATE_CLIENT_ACCOUNT, {
    update(cache, { data, errors }) {
      if (!errors) {
        cache.writeQuery({
          query: VIEWER,
          data: {
            viewer: data.createClientAccount.viewer,
          },
        });
      }
    },
  });
