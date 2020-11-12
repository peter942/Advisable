import React from "react";
import { Tabs, Stack, useModal } from "@advisable/donut";
import { useApolloClient } from "@apollo/client";
import useViewer from "src/hooks/useViewer";
import PreviousProjectFormModal, {
  usePreviousProjectModal,
} from "components/PreviousProjectFormModal";
import PreviousProject from "./PreviousProject";
import NewProject from "components/AddPreviousProjectButton";
import PREVIOUS_PROJECTS from "./previousProjects";
import ValidationModal from "./ValidationModal";
import { Chunk } from 'editmode-react';

export default function PreviousProjectsList({ previousProjects }) {
  const viewer = useViewer();
  const client = useApolloClient();
  const validationModal = useModal();
  const [addedProject, setAddedProject] = React.useState(null);
  const modal = usePreviousProjectModal("/previous_projects/new");

  const drafts = filterByDraft(previousProjects, true);
  const published = filterByDraft(previousProjects, false);

  const handleNewProject = (project) => {
    const previous = client.readQuery({ query: PREVIOUS_PROJECTS });
    client.writeQuery({
      query: PREVIOUS_PROJECTS,
      data: {
        viewer: {
          ...previous.viewer,
          previousProjects: {
            ...previous.viewer.previousProjects,
            nodes: [...previous.viewer.previousProjects.nodes, project],
          },
        },
      },
    });
  };

  const handlePublish = (project) => {
    setAddedProject(project);
    validationModal.show();
  };

  return (
    <>
      {addedProject && (
        <ValidationModal
          modal={validationModal}
          previousProject={addedProject}
        />
      )}

      <PreviousProjectFormModal
        modal={modal}
        specialistId={viewer.id}
        onPublish={handlePublish}
        onCreate={handleNewProject}
      />

      <Tabs label="Previous projects">
        <Tabs.Tab title={<Chunk identifier='published_tab_title'>Published</Chunk>}>
          <Stack pt="m" spacing="m">
            {published.map((project) => (
              <PreviousProject
                key={project.id}
                editModal={modal}
                previousProject={project}
              />
            ))}
            <NewProject modal={modal} />
          </Stack>
        </Tabs.Tab>
        <Tabs.Tab title={draftsTitle(drafts)}>
          <Stack pt="m" spacing="m">
            {drafts.map((project) => (
              <PreviousProject
                key={project.id}
                previousProject={project}
                editModal={modal}
              />
            ))}
            <NewProject modal={modal} />
          </Stack>
        </Tabs.Tab>
      </Tabs>
    </>
  );
}

function draftsTitle(drafts) {
  let draftCount = drafts.length ? `(${drafts.length})` : "";

  return (
    <Chunk identifier='draft_tab_title' variables={{ draft_count: draftCount }}>
      Drafts {draftCount}
    </Chunk>
  );
}

function filterByDraft(data, draft) {
  return data.filter((n) => n.draft === draft);
}
