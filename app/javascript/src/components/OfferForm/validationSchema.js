import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  type: Yup.string(),
  startDate: Yup.date().required("Please enter a start date"),
  endDate: Yup.date()
    .nullable()
    .when("type", {
      is: "Fixed",
      then: Yup.date().required("Please enter an end date")
    })
    .when("startDate", {
      is: startDate => startDate !== undefined,
      then: Yup.date().min(
        Yup.ref("startDate"),
        "End date can not be before the start date"
      )
    }),
  rate: Yup.number().required("Please enter an amount"),
  rateType: Yup.string(),
  rateLimit: Yup.number()
    .nullable()
    .when("rateType", {
      is: "Per Hour",
      then: Yup.number().required("Please enter a rate limit")
    })
});

export default validationSchema;
