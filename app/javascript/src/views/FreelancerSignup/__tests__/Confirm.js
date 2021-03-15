import { renderRoute } from "test-utils";
import generateTypes from "../../../__mocks__/graphqlFields";
import VIEWER from "../../../graphql/queries/viewer";
import GET_SPECIALIST from "../getProfile";
import { CONFIRM } from "../Confirm/ConfirmAccount";

test("Continues to the freelancer preferences step", async () => {
  const viewer = generateTypes.specialist({
    applicationStage: "Started",
    invitations: [],
  });

  const { findByText } = renderRoute({
    route: `/freelancers/signup/confirm?email=${viewer.email}&t=1234`,
    graphQLMocks: [
      {
        request: {
          query: VIEWER,
        },
        result: {
          data: {
            viewer,
          },
        },
      },
      {
        request: {
          query: GET_SPECIALIST,
        },
        result: {
          data: {
            viewer,
          },
        },
      },
      {
        request: {
          query: CONFIRM,
          variables: {
            input: {
              token: "1234",
              email: viewer.email,
            },
          },
        },
        result: {
          data: {
            __typename: "Mutation",
            confirmAccount: {
              __typename: "ConfirmAccountPayload",
              viewer,
              errors: [],
            },
          },
        },
      },
    ],
  });

  const header = await findByText("Freelancing Preferences");
  expect(header).toBeInTheDocument();
});
