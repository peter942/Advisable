import React from "react";
import filter from "lodash/filter";
import { Text } from "@advisable/donut";
import TaskList from "../../components/TaskList";

const CompletedTasks = ({ onSelectTask, application }) => {
  let tasks = filter(application.tasks, (t) => t.stage === "Approved");

  if (tasks.length === 0) {
    return (
      <Text padding="l" textAlign="center" size="xs" color="neutral600">
        You have not completed any projects.
      </Text>
    );
  }

  return <TaskList isClient tasks={tasks} onClickTask={onSelectTask} />;
};

export default CompletedTasks;
