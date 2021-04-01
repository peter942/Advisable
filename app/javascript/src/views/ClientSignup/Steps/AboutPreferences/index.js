import React from "react";
import { Formik, Form } from "formik";
import { string, object, number } from "yup";
import { Redirect, useHistory, useLocation } from "react-router";
// Components
import { Box, useBreakpoint } from "@advisable/donut";
import SubmitButton from "src/components/SubmitButton";
import Loading from "src/components/Loading";
import FormField from "src/components/FormField";
import { Title, Description } from "../styles";
import ProcessingApplication from "./ProcessingApplication";
import TilesInput from "../../TilesInput";
import { Check } from "@styled-icons/feather/Check";
import { X } from "@styled-icons/feather/X";
// Options
import { talentQualityMobileOptions, talentQualityOptions } from "./options";
// Queries
import {
  useAboutPreferencesSubmit,
  useClientApplicationQuery,
} from "../../queries";

const validationSchema = object().shape({
  localityImportance: number().required(
    "Please enter your freelancer locality importance",
  ),
  acceptedGuaranteeTerms: string().required(
    "Please enter your feedback guarantee",
  ),
  talentQuality: string().required(
    "Please enter your required level of talent",
  ),
});

function AboutPreferences() {
  const isMobile = useBreakpoint("s");
  const history = useHistory();
  const location = useLocation();
  const [
    submitClientApplication,
    { called, data: processing },
  ] = useAboutPreferencesSubmit();
  const { loading, error, data } = useClientApplicationQuery();

  if (loading) return <Loading />;
  if (error) return <Redirect to="/client/signup" />;

  const { localityImportance, talentQuality, status } = data.clientApplication;

  if (status !== "Application Started")
    return (
      <Redirect
        to={{
          pathname: "/clients/signup/status",
          state: { ...location.state },
        }}
      />
    );

  // Formik
  const initialValues = {
    localityImportance: localityImportance || undefined,
    acceptedGuaranteeTerms: "",
    talentQuality: talentQuality || "",
  };

  const handleSubmit = async (values) => {
    const convertedValues = {
      ...values,
      acceptedGuaranteeTerms: values.acceptedGuaranteeTerms === "yes",
      localityImportance: Number(values.localityImportance),
    };
    await submitClientApplication({
      variables: {
        input: {
          id: location.state?.applicationId,
          ...convertedValues,
        },
      },
    });

    // Would be nice to find a method to clean this timer
    setTimeout(() => {
      history.push({
        pathname: "/clients/signup/status",
        state: { ...location.state },
      });
    }, 2600);
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form>
          <Box position="relative">
            {called && <ProcessingApplication />}
            <Title>About Your Preferences</Title>
            <Description>
              This is to help tailor our recommendations to you.
            </Description>
            <Box mb="l">
              <FormField
                isRequired
                alignWidth
                as={TilesInput}
                fullWidth
                optionsPerRow={1}
                name="localityImportance"
                onChange={(n) => formik.setFieldValue("localityImportance", n)}
                error={null}
                label="How important is it that freelancers you hire should be in your city?"
                value={formik.values.localityImportance}
                options={[
                  { label: "Not Important", value: 1 },
                  { label: "Not Sure", value: 3 },
                  { label: "Important", value: 5 },
                ]}
              />
            </Box>
            <Box mb="l">
              <FormField
                isRequired
                alignWidth
                as={TilesInput}
                fullWidth
                optionsPerRow={1}
                name="acceptedGuaranteeTerms"
                onChange={(v) =>
                  formik.setFieldValue("acceptedGuaranteeTerms", v)
                }
                error={null}
                label="In order to avail of our money-back guarantee, are you willing to provide feedback on every freelancer you hire?"
                options={[
                  { label: "Yes", value: "yes", icon: Check },
                  { label: "No", value: "no", icon: X },
                ]}
                value={formik.values.acceptedGuaranteeTerms}
              />
            </Box>
            <Box mb="l">
              <FormField
                isRequired
                as={TilesInput}
                alignWidth
                fullWidth
                optionsPerRow={1}
                name="talentQuality"
                onChange={(v) => formik.setFieldValue("talentQuality", v)}
                error={null}
                label="What level of talent are you typically looking for?"
                options={
                  isMobile ? talentQualityMobileOptions : talentQualityOptions
                }
                value={formik.values.talentQuality}
              />
            </Box>
            <SubmitButton width={[1, "auto"]} loading={called && !processing}>
              Continue
            </SubmitButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default AboutPreferences;
