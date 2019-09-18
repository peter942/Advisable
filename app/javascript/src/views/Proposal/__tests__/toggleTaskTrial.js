import { fireEvent, cleanup, within } from "@testing-library/react";
import renderApp from "../../../testHelpers/renderApp";
import generateTypes from "../../../__mocks__/graphqlFields";
import VIEWER from "../../../graphql/queries/viewer";
import GET_APPLICATION from "../fetchApplication";
import GET_TASK from "../../../graphql/queries/taskDetails";
import { UPDATE_TASK } from "../../../components/TaskDrawer/MarkAsTrial";

afterEach(cleanup);

test("Freelancer can toggle the task trial via the task menu", async () => {
  const specialist = generateTypes.specialist();
  const task = generateTypes.task({
    id: "task_1234",
    trial: false,
  });
  const application = generateTypes.application({
    id: "rec1324",
    airtableId: "rec1234",
    tasks: [task],
    trialTask: null,
    trialProgram: true,
    specialist,
    project: generateTypes.project({
      user: generateTypes.user(),
    }),
  });

  const API_MOCKS = [
    {
      request: {
        query: VIEWER,
      },
      result: {
        data: {
          viewer: specialist,
        },
      },
    },
    {
      request: {
        query: GET_APPLICATION,
        variables: {
          id: "rec1234",
        },
      },
      result: {
        data: {
          application,
        },
      },
    },
    {
      request: {
        query: GET_TASK,
        variables: {
          id: "task_1234",
        },
      },
      result: {
        data: {
          task: {
            ...task,
            application,
          },
        },
      },
    },
    {
      request: {
        query: UPDATE_TASK,
        variables: {
          input: {
            id: "task_1234",
            trial: true,
          },
        },
      },
      result: {
        data: {
          __typename: "Mutation",
          updateTask: {
            __typename: "UpdateTaskPayload",
            task: {
              ...task,
              trial: true,
              application: {
                ...application,
                trialTask: task,
              },
            },
          },
        },
      },
    },
  ];

  const { findByText, findByLabelText } = renderApp({
    route: "/applications/rec1234/proposal/tasks/task_1234",
    graphQLMocks: API_MOCKS,
  });

  const openMenu = await findByLabelText("Open task actions menu");
  fireEvent.click(openMenu);
  const menu = await findByLabelText("Task actions");
  const toggle = within(menu).getByText("actions.markTaskAsTrial");
  fireEvent.click(toggle);
  const notice = await findByText(
    "This task has been offered as a guaranteed trial"
  );
  expect(notice).toBeInTheDocument();
});
