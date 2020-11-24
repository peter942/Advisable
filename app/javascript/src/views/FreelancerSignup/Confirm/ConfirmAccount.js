import React, { useCallback } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import Loading from "../../../components/Loading";
import VIEWER, { viewerFields } from "../../../graphql/queries/viewer";
import { useNotifications } from "../../../components/Notifications";

export const CONFIRM = gql`
  ${viewerFields}

  mutation ConfirmAccount($input: ConfirmAccountInput!) {
    confirmAccount(input: $input) {
      viewer {
        ...ViewerFields
      }
    }
  }
`;

// Renders the freelancer signup flow.
const ConfirmAccount = ({ token, email, history }) => {
  const { notify } = useNotifications();

  const [confirm] = useMutation(CONFIRM, {
    update(cache, response) {
      if (!response.errors) {
        const existing = cache.readQuery({ query: VIEWER });
        cache.writeQuery({
          query: VIEWER,
          data: {
            viewer: {
              ...existing?.viewer,
              ...response.data.confirmAccount.viewer,
            },
          },
        });
      }
    },
  });

  const confirmAccount = useCallback(async () => {
    const { errors } = await confirm({
      variables: {
        input: {
          token,
          email,
        },
      },
    });

    if (errors) {
      notify("Failed to confirm your account. Please try again.");
      history.replace("/freelancers/signup/confirm");
    } else {
      window.location = "/freelancers/signup/preferences";
    }
  }, [confirm, email, token, history, notify]);

  React.useEffect(() => {
    confirmAccount();
  }, [confirmAccount]);

  return <Loading />;
};

export default ConfirmAccount;
