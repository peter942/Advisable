import * as React from "react";
import { withApollo } from "react-apollo";
import { matchPath } from "react-router";
import Card from "../../components/Card";
import Text from "../../components/Text";
import Button from "../../components/Button";
import Notice from "../../components/Notice";
import ButtonGroup from "../../components/ButtonGroup";
import Heading from "../../components/Heading";
import NewTask from "../../components/NewTask";
import TaskList from "../../components/TaskList";
import TaskDrawer from "../../components/TaskDrawer";
import { Padding } from "../../components/Spacing";
import { useMobile } from "../../components/Breakpoint";
import FETCH_APPLICATION from "./fetchApplication";
import { hasCompleteTasksStep } from "./validationSchema";

const Tasks = ({ application, match, location, history, client }) => {
  const isMobile = useMobile();
  const onSelectTask = task => {
    history.push(`${match.url}/${task.id}`);
  };

  const applicationQuery = {
    query: FETCH_APPLICATION,
    variables: {
      id: application.airtableId,
    },
  };

  const handleNewTask = task => {
    const newData = client.readQuery(applicationQuery);
    newData.application.tasks.push(task);
    client.writeQuery({
      ...applicationQuery,
      data: newData,
    });

    history.push(`${match.url}/${task.id}`);
  };

  const handleDeleteTask = task => {
    history.push(match.url);
    const newData = client.readQuery(applicationQuery);
    newData.application.tasks = application.tasks.filter(t => {
      return t.id !== task.id;
    });
    client.writeQuery({
      ...applicationQuery,
      data: newData,
    });
  };

  const taskMatch = matchPath(location.pathname, {
    path: "*/tasks/:taskId",
  });

  const handleContinue = () => {
    history.push("send");
  };

  const hasTasks = application.tasks.length > 0;
  // Wether or not the continue button should be visible
  const canContinue = hasCompleteTasksStep(application);

  const showPromptForTask = task => {
    return !Boolean(task.name) || !Boolean(task.description);
  };

  return (
    <Card>
      <Padding size="l">
        <Padding bottom="s">
          <Heading level={3}>Project Tasks</Heading>
        </Padding>
        <Text size="s">
          Tasks allow you and {application.project.user.companyName} to easily
          define and track the work that you would be doing throughout this
          project. Add at least one task that you would suggest for this
          project.
        </Text>
      </Padding>
      <TaskList
        hideStatus
        tasks={application.tasks}
        onClickTask={onSelectTask}
        showPromptForTask={showPromptForTask}
        lastRow={<NewTask onCreate={handleNewTask} application={application} />}
      />
      <TaskDrawer
        hideStatus
        onClose={() => history.push(match.url)}
        taskId={taskMatch ? taskMatch.params.taskId : null}
        onDeleteTask={handleDeleteTask}
      />
      {hasTasks && !canContinue && (
        <Padding size="l">
          <Notice icon="alert-triangle">
            Please add a name and description for each task to continue
          </Notice>
        </Padding>
      )}
      {canContinue && (
        <Padding size="l">
          <ButtonGroup fullWidth={isMobile}>
            <Button styling="primary" onClick={handleContinue}>
              Continue
            </Button>
          </ButtonGroup>
        </Padding>
      )}
    </Card>
  );
};

export default withApollo(Tasks);
