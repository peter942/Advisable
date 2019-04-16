import React from "react";
import { graphql } from "react-apollo";
import Card from "../../components/Card";
import Text from "../../components/Text";
import Back from "../../components/Back";
import { FadeInUp } from "../../components/Animation";
import Heading from "../../components/Heading";
import TaskList from "../../components/TaskList";
import Message from "../../components/Message";
import TaskDrawer from "../../components/TaskDrawer";
import SkeletonText from "../../components/SkeletonText";
import SkeletonHeading from "../../components/SkeletonHeading";
import { Padding } from "../../components/Spacing";
import FETCH_PROPOSAL from "./fetchProposal.graphql";

const Loaded = ({ data }) => {
  const [selectedTask, setSelectedTask] = React.useState(null);
  const application = data.application;
  const project = data.application.project;
  const specialist = data.application.specialist;

  const handleSelectTask = task => {
    setSelectedTask(task.id);
  };

  return (
    <>
      <Padding left="xl" right="xl" top="xl" bottom="l">
        <Back
          to={`/projects/${project.airtableId}/applications/${
            data.application.airtableId
          }`}
        >
          Back to application
        </Back>
      </Padding>
      <Padding left="xl" right="xl" bottom="s">
        <Heading level={3}>Proposal for "{project.primarySkill}"</Heading>
      </Padding>
      <Padding left="xl" right="xl" bottom="l">
        <Text size="s">
          Accepting this proposal wont assign any tasks. You’ll have the
          opportunity to assign and add tasks once you start working with{" "}
          {specialist.firstName}. Once you assign a task, if you’re not happy
          with the quality of the work, we’ll give you a 100% refund for up to 8
          hours work.
        </Text>
      </Padding>
      {application.proposalComment && (
        <Padding left="xl" right="xl" bottom="xl">
          <Message title={`Message from ${specialist.firstName}`}>
            {application.proposalComment}
          </Message>
        </Padding>
      )}
      <Padding left="xl" bottom="m">
        <Text weight="semibold" colour="dark">
          Suggested tasks
        </Text>
      </Padding>
      <TaskDrawer taskId={selectedTask} onClose={() => setSelectedTask(null)} />
      <Padding bottom="l">
        <TaskList
          hideStatus
          tasks={application.tasks}
          onClickTask={handleSelectTask}
        />
      </Padding>
    </>
  );
};

const Loading = () => (
  <Padding size="xl">
    <Padding bottom="m">
      <SkeletonHeading />
    </Padding>
    <SkeletonText />
  </Padding>
);

const Proposal = ({ data }) => {
  return (
    <FadeInUp>
      <Card>{data.loading ? <Loading /> : <Loaded data={data} />}</Card>
    </FadeInUp>
  );
};

export default graphql(FETCH_PROPOSAL, {
  options: props => ({
    variables: {
      id: props.match.params.applicationID,
    },
  }),
})(Proposal);
