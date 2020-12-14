import React from "react";
import { useParams, useHistory, useLocation, Redirect } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ArrowRight } from "@styled-icons/feather";
import { Formik, Form, Field } from "formik";
import { Error } from "@advisable/donut";
import SubmitButton from "components/SubmitButton";
import BulletPointInput from "components/BulletPointInput";
import { UPDATE_PROJECT } from "./queries";
import { JobSetupStepHeader, JobSetupStepSubHeader } from "./styles";
import { setupProgress } from "./SetupSteps";

export default function JobDescription({ data }) {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [updateProject] = useMutation(UPDATE_PROJECT);
  const goalMaxLength = 375;

  if (!setupProgress(data.project).requiredCharacteristics) {
    return <Redirect to={`/projects/${id}/setup/characteristics`} />;
  }

  const { primarySkill } = data.project;

  const initialValues = {
    goals: data.project.goals,
  };

  const handleSubmit = async (values, formik) => {
    const response = await updateProject({
      variables: {
        input: {
          id,
          ...values,
        },
      },
    });

    if (response.errors) {
      formik.setStatus("Failed to update description, please try again.");
    } else {
      if (location.state?.readyToPublish) {
        history.push(`/projects/${id}/setup/publish`);
      } else {
        history.push(`/projects/${id}/setup/likely_to_hire`);
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => (
        <Form>
          <JobSetupStepHeader mb={2}>
            Briefly describe your goals from working with this specialist
          </JobSetupStepHeader>
          <JobSetupStepSubHeader mb={6}>
            We&apos;ll make sure that specialists we match you with have
            experience helping companies achieve similar goals.
          </JobSetupStepSubHeader>
          <Field
            name="goals"
            as={BulletPointInput}
            marginBottom={3}
            placeholder={
              primarySkill?.goalPlaceholder ||
              "e.g Building a Facebook advertising campaign for launching our new product"
            }
            onChange={(items) =>
              formik.setFieldValue(
                "goals",
                items.map((item) => {
                  formik.setStatus(
                    item.length > goalMaxLength
                      ? `The goal can't be longer than ${goalMaxLength} characters`
                      : null,
                  );
                  return item.substring(0, goalMaxLength);
                }),
              )
            }
          />
          {formik.status && <Error mb={1}>{formik.status}</Error>}
          <SubmitButton
            size="l"
            marginTop={3}
            suffix={<ArrowRight />}
            disabled={formik.values.goals.length === 0}
          >
            Continue
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
