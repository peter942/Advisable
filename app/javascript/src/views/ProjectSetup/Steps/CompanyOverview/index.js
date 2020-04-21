import React, { Fragment } from "react";
import { Formik } from "formik";
import { RoundedButton } from "@advisable/donut";
import { useMutation } from "@apollo/react-hooks";
import Text from "src/components/Text";
import TextField from "src/components/TextField";
import validationSchema from "./validationSchema";
import UPDATE_PROJECT from "../../updateProject.graphql";

export default ({ project, match, history }) => {
  const [mutate] = useMutation(UPDATE_PROJECT);
  const id = match.params.projectID;
  const goBack = () => history.push(`/project_setup/${id}`);

  return (
    <Fragment>
      <Text marginBottom="l">
        Provide freelancers with a high-level overview of your company to
        provide them with context and allow them to tailor their pitch
        accordingly.
      </Text>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          companyDescription: project.companyDescription || "",
        }}
        onSubmit={async (values) => {
          const id = match.params.projectID;
          await mutate({
            variables: {
              input: {
                id,
                ...values,
              },
            },
          });
          history.push(`/project_setup/${id}/project_overview`);
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              multiline
              autoHeight
              name="companyDescription"
              value={formik.values.companyDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Company overview.."
              marginBottom="xl"
              error={formik.submitCount > 0 && formik.errors.companyDescription}
            />
            <RoundedButton
              mr="xs"
              type="button"
              size="l"
              variant="subtle"
              onClick={goBack}
            >
              Back
            </RoundedButton>
            <RoundedButton size="l" type="submit" loading={formik.isSubmitting}>
              Continue
            </RoundedButton>
          </form>
        )}
      </Formik>
    </Fragment>
  );
};
