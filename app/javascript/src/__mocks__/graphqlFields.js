import { merge, uniqueId } from "lodash";

export const user = (fields = {}) => {
  return merge(
    {
      __typename: "User",
      id: uniqueId("user"),
      firstName: "Test",
      lastName: "Account",
      name: "Test Account",
      email: "test@test.com",
      airtableId: "airtableid",
      confirmed: true,
      companyName: "Test Corp",
      completedTutorials: [],
      talkSignature: "1234",
      createdAt: new Date().toISOString(),
      projectPaymentMethod: "Bank Transfer",
      customer: {
        __typename: "Customer",
        id: "cus_123",
        name: null,
        email: null,
      },
      country: {
        __typename: "Country",
        id: 1,
        name: "Ireland",
      },
    },
    fields
  );
};

export const country = (fields = {}) => {
  return merge(
    {
      __typename: "Country",
      id: "IE",
      eu: true,
      name: "Ireland",
      states: ["Dublin", "Cork", "Galway", "Limerick"],
    },
    fields
  );
};

export const project = (fields = {}) => {
  return merge(
    {
      __typename: "Project",
      id: uniqueId("project"),
      airtableId: uniqueId("rec"),
      name: "Project",
      currency: "USD",
      questions: ["Question?"],
      applicationsOpen: true,
      primarySkill: "Testing",
      description: "desription",
      applicationCount: 0,
      status: "Brief Confirmed",
      clientReferralUrl: "https://advisable.com",
      companyDescription: "company description",
      specialistDescription: "specialist description",
      goals: ["This is a goal"],
      requiredCharacteristics: ["Required characteristic"],
      optionalCharacteristics: ["Optional characteristic"],
      estimatedBudget: "€10,000",
      remote: true,
    },
    fields
  );
};

export const application = (fields = {}) => {
  return merge(
    {
      __typename: "Application",
      id: uniqueId("application"),
      airtableId: uniqueId("rec"),
      rate: "75",
      currency: "USD",
      status: "Working",
      featured: false,
      comment: "comment",
      hidden: false,
      monthlyLimit: null,
      referencesRequested: false,
      projectType: "Fixed",
      referralUrl: "https//advisable.com",
      introduction: "Application Introduction",
      availability: "2 - 4 Weeks",
      acceptsFee: true,
      acceptsTerms: true,
      proposal: null,
      proposalComment: "",
      questions: [
        {
          __typename: "ApplicationQuestion",
          question: "This is a question?",
          answer: "This is the answer",
        },
      ],
      tasks: [],
      previousProjects: [],
    },
    fields
  );
};

export const specialist = (fields = {}) => {
  return merge(
    {
      __typename: "Specialist",
      id: uniqueId("specialist"),
      bio: "Specialist bio",
      airtableId: uniqueId("rec"),
      name: "Test Specialist",
      firstName: "Test",
      lastName: "Specialist",
      confirmed: true,
      email: "specialist@test.com",
      completedTutorials: [],
      talkSignature: "1234",
      createdAt: new Date().toISOString(),
      city: "Dublin",
      reviewsCount: 0,
      hasSetupPayments: true,
      ratings: {
        __typename: "Ratings",
        overall: 5.0,
      },
      image: null,
      country: {
        __typename: "Country",
        id: 1,
        name: "Ireland",
      },
      linkedin: "https://linkedin.com",
      previousProjects: [],
      skills: ["Testing"],
    },
    fields
  );
};

export const task = (fields = {}) => {
  return merge(
    {
      __typename: "Task",
      id: uniqueId("task"),
      name: null,
      stage: "Not Assigned",
      dueDate: null,
      estimate: null,
      description: null,
      repeat: null,
      hoursWorked: null,
      flexibleEstimate: null,
      createdAt: new Date().toISOString(),
    },
    fields
  );
};

export const skill = (fields = {}) => {
  return merge({
    __typename: "Skill",
    id: uniqueId("skill"),
    name: "Skill",
  });
};

export const industry = (fields = {}) => {
  return merge({
    __typename: "Industry",
    id: uniqueId("industry"),
    name: "Industry",
  });
};

export default {
  user,
  task,
  skill,
  country,
  project,
  industry,
  application,
  specialist,
};
