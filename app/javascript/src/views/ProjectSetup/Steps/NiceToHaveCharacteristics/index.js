import React, { Fragment, useEffect } from "react";
import { Mutation } from "react-apollo";
import { Formik } from "formik";
import Text from "src/components/Text";
import Button from "src/components/Button";
import ListInput from "src/components/ListInput";
import { Mobile } from "src/components/Breakpoint";
import ButtonGroup from "src/components/ButtonGroup";
import validationSchema from "./validationSchema";
import UPDATE_PROJECT from "../../updateProject.graphql";

export default ({ project, match, history }) => {
  const id = match.params.projectID;
  const goBack = () => history.push(`/project_setup/${id}/must_have`);

  useEffect(() => {
    if (project.requiredCharacteristics.length === 0) {
      history.replace("must_have");
    }
  }, []);

  return (
    <Mutation mutation={UPDATE_PROJECT}>
      {mutate => (
        <Fragment>
          <Text marginBottom="l">
            Please list any skills and experience that would be an added bonus
            for candidates to have, but are not required
          </Text>
          <Formik
            initialValues={{
              optionalCharacteristics: project.optionalCharacteristics,
            }}
            validationSchema={validationSchema}
            onSubmit={async values => {
              const id = match.params.projectID;
              await mutate({
                variables: {
                  input: {
                    id,
                    ...values,
                  },
                },
              });
              history.push(`/project_setup/${id}/questions`);
            }}
          >
            {formik => (
              <form onSubmit={formik.handleSubmit}>
                <ListInput
                  marginBottom="xl"
                  name="optionalCharacteristics"
                  value={formik.values.optionalCharacteristics}
                  placeholder="+ Add a characteristic"
                  error={
                    formik.submitCount > 0 &&
                    formik.errors.optionalCharacteristics
                  }
                  onChange={characteristics =>
                    formik.setFieldValue(
                      "optionalCharacteristics",
                      characteristics
                    )
                  }
                />
                <Mobile>
                  {isMobile => (
                    <ButtonGroup fullWidth={isMobile}>
                      <Button
                        type="button"
                        size="l"
                        styling="outlined"
                        onClick={goBack}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        size="l"
                        styling="primary"
                        loading={formik.isSubmitting}
                      >
                        Continue
                      </Button>
                    </ButtonGroup>
                  )}
                </Mobile>
              </form>
            )}
          </Formik>
        </Fragment>
      )}
    </Mutation>
  );
};
