import React, { useMemo, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import queryString from "query-string";
import { useStartClientApplication, ABOUT_COMPANY_QUERY } from "../../queries";
import { Formik, Form } from "formik";
import { useLocation, useHistory } from "react-router";
import SubmitButton from "../../../../components/SubmitButton";
import FormField from "src/components/FormField";
import { Input, Box, useBreakpoint } from "@advisable/donut";
import Loading from "../../../../components/Loading";
import MotionStack from "../MotionStack";
import Navigation from "../Navigation";
import { Title } from "../styles";
import { motion } from "framer-motion";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string(),
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Please enter your company email address"),
});

function StartApplication() {
  const [
    startClientApplication,
    { error, data, client, called, loading },
  ] = useStartClientApplication();
  const location = useLocation();
  const history = useHistory();
  const isMobile = useBreakpoint("m");
  const [applicationId, setApplicationId] = useState();
  const queryParams = useMemo(
    () => queryString.parse(location.search, { decode: true }),
    [location.search],
  );

  const updateLocationState = useCallback(
    (params) => {
      history.replace({ ...location, state: { ...location.state, ...params } });
    },
    [history, location],
  );

  const handleStartApplication = useCallback(
    async function (values) {
      updateLocationState({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      });

      return await startClientApplication({
        variables: {
          input: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            rid: queryParams.rid,
            utmMedium: queryParams.utmMedium,
            utmSource: queryParams.utmSource,
            utmCampaign: queryParams.utmCampaign,
          },
        },
      });
    },
    [updateLocationState, startClientApplication, queryParams],
  );

  // Check query params
  useEffect(() => {
    const { firstName, lastName, email } = queryParams;
    if (!called && firstName && lastName && email) {
      const valid = validationSchema.validateSync({
        firstName,
        lastName,
        email,
      });
      if (!valid) return;
      handleStartApplication(queryParams);
    }
  }, [queryParams, called, handleStartApplication]);

  // Handle mutation errors
  const errorCodes = error?.graphQLErrors.map((err) => err.extensions?.code);
  const emailNotAllowed = errorCodes?.includes("emailNotAllowed");
  const existingAccount = errorCodes?.includes("existingAccount");
  useEffect(() => {
    const prefetchNextStep = async (id) => {
      await client.query({
        query: ABOUT_COMPANY_QUERY,
        variables: { id },
      });
      setApplicationId(id);
    };
    let applicationId = data?.startClientApplication?.clientApplication?.id;
    applicationId && prefetchNextStep(applicationId);
  }, [data, client]);

  if (loading)
    return (
      <motion.div exit>
        <Navigation
          emailNotAllowed={emailNotAllowed}
          existingAccount={existingAccount}
          called={called}
          applicationId={applicationId}
        />
        <Loading />
      </motion.div>
    );

  // Formik
  const initialValues = {
    firstName: location.state?.firstName || queryParams.firstName || "",
    lastName: location.state?.lastName || queryParams.lastName || "",
    email: queryParams.email || "",
  };

  const handleSubmit = (values) => {
    handleStartApplication(values);
  };

  return (
    <>
      <Navigation
        emailNotAllowed={emailNotAllowed}
        existingAccount={existingAccount}
        called={called}
        applicationId={applicationId}
      />
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <MotionStack>
              <Title mb="m">Start Your Application</Title>
              <Box display={isMobile ? "block" : "flex"} mb="s">
                <Box flex="1" mr={!isMobile && "s"} mb={isMobile && "s"}>
                  <FormField
                    isRequired
                    as={Input}
                    name="firstName"
                    placeholder="First name"
                    label="First name"
                  />
                </Box>
                <Box flex="1">
                  <FormField
                    as={Input}
                    name="lastName"
                    placeholder="Last name"
                    label="Last name"
                  />
                </Box>
              </Box>
              <Box mb="l">
                <FormField
                  isRequired
                  as={Input}
                  name="email"
                  placeholder="name@company.com"
                  label="Company email address"
                />
              </Box>
              <SubmitButton width={[1, "auto"]}>Continue</SubmitButton>
            </MotionStack>
          </Form>
        )}
      </Formik>
    </>
  );
}

StartApplication.propTypes = {
  RedirectToNextStep: PropTypes.elementType,
  redirectToNextStep: PropTypes.func,
};

export default StartApplication;
