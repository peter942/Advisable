// Renders the projects view for a user.
import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Container, Heading } from "@advisable/donut";
import Loading from "./Loading";
import { GET_PROJECTS } from "./queries";
import ProjectsList from "./ProjectsList";
import dataLayer from "src/utilities/dataLayer";
import ExplorerEmptyView from "./ExplorerEmptyView";

const Projects = () => {
  const location = useLocation();
  const { loading, data } = useQuery(GET_PROJECTS);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleCreate = (cache, response) => {
    const { currentCompany, viewer } = cache.readQuery({ query: GET_PROJECTS });

    dataLayer.push({
      event: "projectStarted",
      projectId: response.data.createJob.project.id,
      projectCount: currentCompany.projects.length + 1,
    });

    cache.writeQuery({
      query: GET_PROJECTS,
      data: {
        viewer,
        currentCompany: {
          ...currentCompany,
          projects: [
            response.data.createJob.project,
            ...currentCompany.projects,
          ],
        },
      },
    });
  };

  const hasProjects = (data?.currentCompany?.projects || []).length > 0;
  if (!loading && !hasProjects) {
    return <ExplorerEmptyView />;
  }

  return (
    <Container py="xl">
      <Heading mb={6}>Your Projects</Heading>

      {loading ? (
        <Loading />
      ) : (
        <ProjectsList
          projects={data.currentCompany.projects}
          onCreate={handleCreate}
        />
      )}
    </Container>
  );
};

export default Projects;
