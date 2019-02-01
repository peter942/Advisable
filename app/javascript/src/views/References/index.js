// Renders the view that allows specialists to manage their references.
import React, { useState } from "react";
import Text from "../../components/Text";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Container from "../../components/Container";
import AddPreviousProjectModal from "../../components/AddPreviousProjectModal";
import PreviousProjects from "./PreviousProjects";
import PREVIOUS_PROJECTS from "./PreviousProjects/previousProjects.graphql";

const References = ({ match, history }) => {
  const { specialistID } = match.params;
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddProject = () => setModalOpen(true);

  return (
    <React.Fragment>
      <Header />
      <Container size="m">
        <Heading marginBottom="m" level="1">
          Previous Projects
        </Heading>
        <Text marginBottom="l">
          Previous projects are one of the most effective ways to validate your
          skills and experience. Advisable uses them to decide who to invite to
          our platform, which projects to invite them to and gives you the
          opportunity to share them with clients when you’re applying for
          projects.
        </Text>

        <Button
          marginBottom="xl"
          size="l"
          styling="primary"
          onClick={handleAddProject}
        >
          Add a previous project
        </Button>
        <AddPreviousProjectModal
          isOpen={modalOpen}
          specialistId={specialistID}
          onClose={() => setModalOpen(false)}
          mutationUpdate={(proxy, response) => {
            const data = proxy.readQuery({
              query: PREVIOUS_PROJECTS,
              variables: { id: specialistID }
            });
            const project =
              response.data.createOffPlatformProject.previousProject;
            data.specialist.previousProjects.unshift(project);
            proxy.writeQuery({ query: PREVIOUS_PROJECTS, data });
          }}
        />

        <Heading level="6" paddingTop="l" marginBottom="s">
          Previous Projects
        </Heading>
        <PreviousProjects specialistId={match.params.specialistID} />
      </Container>
    </React.Fragment>
  );
};

export default References;
