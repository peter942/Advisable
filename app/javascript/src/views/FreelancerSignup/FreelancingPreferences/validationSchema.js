import { object, string, boolean, number } from "yup";

const validationSchema = object().shape({
  primarilyFreelance: boolean()
    .nullable()
    .required(
      "Please specify whether or not freelancing is your primary occupation.",
    ),
  numberOfProjects: string()
    .nullable()
    .required(
      "Please select how many previous freelance projects you have completed.",
    ),
  hourlyRate: number().nullable().required("Please define your hourly rate."),
});

export default validationSchema;
