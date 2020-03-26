import { fireEvent, waitFor, within } from "@testing-library/react";
import renderApp from "../../testHelpers/renderApp";
import mockData from "../../__mocks__/graphqlFields";
import { mockViewer, mockQuery } from "../../testHelpers/apolloMocks";
import GET_PROFILE from "./getProfile";
import PROJECT_DETAILS from "./ProjectDetails/getProject";

test("Shows users profile", async () => {
  const skill = mockData.skill();
  const industry = mockData.industry();
  const profileProject = mockData.profileProject({
    industry,
    skills: [skill],
    industries: [industry],
  });

  const review = mockData.review();

  const specialist = mockData.specialist({
    name: "John Doe",
    projectSkills: {
      __typename: "ProjectSkillsConnection",
      nodes: [skill],
    },
    industries: [industry],
    reviews: [review],
    profileProjects: {
      __typename: "ProfileProjectsConnection",
      nodes: [profileProject],
    },
  });

  profileProject.specialist = specialist;

  const graphQLMocks = [
    mockViewer(null),
    mockQuery(GET_PROFILE, { id: specialist.id }, { specialist }),
  ];

  const app = renderApp({
    route: `/freelancers/${specialist.id}`,
    graphQLMocks,
  });

  const name = await app.findByText("John Doe");
  expect(name).toBeInTheDocument();
});

test("Can see reviews", async () => {
  const skill = mockData.skill();
  const industry = mockData.industry();
  const profileProject = mockData.profileProject({
    industry,
    skills: [skill],
    industries: [industry],
  });

  const review = mockData.review();

  const specialist = mockData.specialist({
    name: "John Doe",
    projectSkills: {
      __typename: "ProjectSkillsConnection",
      nodes: [skill],
    },
    industries: [industry],
    reviews: [review],
    profileProjects: {
      __typename: "ProfileProjectsConnection",
      nodes: [profileProject],
    },
  });

  profileProject.specialist = specialist;

  const graphQLMocks = [
    mockViewer(null),
    mockQuery(GET_PROFILE, { id: specialist.id }, { specialist }),
  ];

  const app = renderApp({
    route: `/freelancers/${specialist.id}/reviews`,
    graphQLMocks,
  });

  const name = await app.findByText(`"${review.comment}"`);
  expect(name).toBeInTheDocument();
});

test("Renders 404 if the specialist isn't found", async () => {
  const graphQLMocks = [
    mockViewer(null),
    {
      request: {
        query: GET_PROFILE,
        variables: {
          id: "randomID",
        },
      },
      result: {
        errors: [
          {
            message: "Resouce was not found",
            locations: [
              {
                line: 2,
                column: 3,
              },
            ],
            path: ["specialist"],
            extensions: {
              type: "INVALID_REQUEST",
              code: "notFound",
            },
          },
        ],
      },
    },
  ];

  const app = renderApp({
    route: `/freelancers/randomID`,
    graphQLMocks,
  });

  const status = await app.findByText("404");
  expect(status).toBeInTheDocument();
});

test("Can view freelancer project", async () => {
  const skill = mockData.skill();
  const industry = mockData.industry();
  const profileProject = mockData.profileProject({
    industry,
    skills: [skill],
    industries: [industry],
  });

  const specialist = mockData.specialist({
    name: "John Doe",
    projectSkills: {
      __typename: "ProjectSkillsConnection",
      nodes: [skill],
    },
    industries: [industry],
    reviews: [],
    profileProjects: {
      __typename: "ProfileProjectsConnection",
      nodes: [profileProject],
    },
  });

  const graphQLMocks = [
    mockViewer(null),
    mockQuery(GET_PROFILE, { id: specialist.id }, { specialist }),
    mockQuery(
      PROJECT_DETAILS,
      {
        specialist: specialist.id,
        project: profileProject.id,
      },
      {
        specialist: {
          ...specialist,
          profileProject: {
            ...profileProject,
            specialist,
          },
        },
      }
    ),
  ];

  const app = renderApp({
    route: `/freelancers/${specialist.id}/projects`,
    graphQLMocks,
  });

  await app.findByText("John Doe");
  const viewProject = app.getByLabelText("View Project");
  fireEvent.click(viewProject);
  const modal = app.getByRole("dialog");
  const title = await within(modal).findByText(profileProject.title);
  expect(title).toBeInTheDocument();
});

test("Can view a project by giong to url", async () => {
  const skill = mockData.skill();
  const industry = mockData.industry();
  const profileProject = mockData.profileProject({
    industry,
    skills: [skill],
    industries: [industry],
  });

  const specialist = mockData.specialist({
    name: "John Doe",
    projectSkills: {
      __typename: "ProjectSkillsConnection",
      nodes: [skill],
    },
    industries: [industry],
    reviews: [],
    profileProjects: {
      __typename: "ProfileProjectsConnection",
      nodes: [profileProject],
    },
  });

  const graphQLMocks = [
    mockViewer(null),
    mockQuery(GET_PROFILE, { id: specialist.id }, { specialist }),
    mockQuery(
      PROJECT_DETAILS,
      {
        specialist: specialist.id,
        project: profileProject.id,
      },
      {
        specialist: {
          ...specialist,
          profileProject: {
            ...profileProject,
            specialist,
          },
        },
      }
    ),
  ];

  const app = renderApp({
    route: `/freelancers/${specialist.id}/projects/${profileProject.id}`,
    graphQLMocks,
  });

  const modal = await app.findByRole("dialog");
  const title = await within(modal).findByText(profileProject.title);
  expect(title).toBeInTheDocument();
});

test("Shows message when specialist has no projects", async () => {
  const skill = mockData.skill();
  const industry = mockData.industry();

  const specialist = mockData.specialist({
    name: "John Doe",
    projectSkills: {
      __typename: "ProjectSkillsConnection",
      nodes: [skill],
    },
    industries: [industry],
    reviews: [],
    profileProjects: {
      __typename: "ProfileProjectsConnection",
      nodes: [],
    },
  });

  const graphQLMocks = [
    mockViewer(null),
    mockQuery(GET_PROFILE, { id: specialist.id }, { specialist }),
  ];

  const app = renderApp({
    route: `/freelancers/${specialist.id}/projects`,
    graphQLMocks,
  });

  const text = await app.findByText("has not added any previous projects", {
    exact: false,
  });
  expect(text).toBeInTheDocument();
});

test("Can filter projects by skill", async () => {
  const twitterMarketing = mockData.skill({ name: "Twitter Marketing" });
  const facebookMarketing = mockData.skill({ name: "Facebook Marketing" });
  const financeIndustry = mockData.industry({ name: "Finance" });
  const recruitingIndustry = mockData.industry({ name: "Recruiting" });

  const financeProject = mockData.profileProject({
    title: "Finance Project",
    industry: financeIndustry,
    skills: [twitterMarketing],
    industries: [financeIndustry],
  });

  const recruitingProject = mockData.profileProject({
    title: "Recruiting Project",
    industry: recruitingIndustry,
    skills: [facebookMarketing],
    industries: [recruitingIndustry],
  });

  const specialist = mockData.specialist({
    name: "John Doe",
    projectSkills: {
      __typename: "ProjectSkillsConnection",
      nodes: [twitterMarketing, facebookMarketing],
    },
    industries: [financeIndustry, recruitingIndustry],
    reviews: [],
    profileProjects: {
      __typename: "ProfileProjectsConnection",
      nodes: [financeProject, recruitingProject],
    },
  });

  const graphQLMocks = [
    mockViewer(null),
    mockQuery(GET_PROFILE, { id: specialist.id }, { specialist }),
  ];

  const app = renderApp({
    route: `/freelancers/${specialist.id}/projects`,
    graphQLMocks,
  });

  const skillFilter = await app.findByLabelText("Filter projects by Skill");
  fireEvent.click(skillFilter);
  const skill = app.getByLabelText(twitterMarketing.name);
  fireEvent.click(skill);
  fireEvent.click(app.getByLabelText("Filter by Skill"));
  await waitFor(() => {}) // Wait for filter to be applied
  expect(app.queryByText("Recruiting Project")).toBeNull();
});

test("Can filter projects by industry", async () => {
  const twitterMarketing = mockData.skill({ name: "Twitter Marketing" });
  const facebookMarketing = mockData.skill({ name: "Facebook Marketing" });
  const financeIndustry = mockData.industry({ name: "Finance" });
  const recruitingIndustry = mockData.industry({ name: "Recruiting" });

  const financeProject = mockData.profileProject({
    title: "Finance Project",
    industry: financeIndustry,
    skills: [twitterMarketing],
    industries: [financeIndustry],
  });

  const recruitingProject = mockData.profileProject({
    title: "Recruiting Project",
    industry: recruitingIndustry,
    skills: [facebookMarketing],
    industries: [recruitingIndustry],
  });

  const specialist = mockData.specialist({
    name: "John Doe",
    projectSkills: {
      __typename: "ProjectSkillsConnection",
      nodes: [twitterMarketing, facebookMarketing],
    },
    industries: [financeIndustry, recruitingIndustry],
    reviews: [],
    profileProjects: {
      __typename: "ProfileProjectsConnection",
      nodes: [financeProject, recruitingProject],
    },
  });

  const graphQLMocks = [
    mockViewer(null),
    mockQuery(GET_PROFILE, { id: specialist.id }, { specialist }),
  ];

  const app = renderApp({
    route: `/freelancers/${specialist.id}/projects`,
    graphQLMocks,
  });

  const filter = await app.findByLabelText("Filter projects by Industry");
  expect(app.queryByText("Recruiting Project")).toBeInTheDocument();
  fireEvent.click(filter);
  const industry = app.getByLabelText(financeIndustry.name);
  fireEvent.click(industry);
  fireEvent.click(app.getByLabelText("Filter by Industry"));
  await waitFor(() => {}) // Wait for filter to be applied
  expect(app.queryByText("Recruiting Project")).toBeNull();
});
