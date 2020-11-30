import React from "react";
import { Formik, Form } from "formik";
import { object, string, ref } from "yup";
import { useTranslation } from "react-i18next";
import { Redirect, useLocation } from "react-router";
import { Card, Box, Text } from "@advisable/donut";
import FormField from "src/components/FormField";
import SubmitButton from "src/components/SubmitButton";
import useViewer from "src/hooks/useViewer";
import { useUpdatePassword } from "./queries";

const validationSchema = object({
  password: string()
    .required("Please enter a password")
    .min(8, "Your password must be at least 8 characters long"),
  passwordConfirmation: string()
    .oneOf([ref("password"), null], "Password does not match")
    .required("Please confirm your password"),
});

export default function SetPassword() {
  const viewer = useViewer();
  const location = useLocation();
  const { t } = useTranslation();
  const [setPassword] = useUpdatePassword();
  const { from } = location.state || {
    from: { pathname: "/" },
  };

  if (!viewer.needsToSetAPassword) {
    return <Redirect to={from} />;
  }

  const initialValues = {
    password: "",
    passwordConfirmation: "",
  };

  async function handleSubmit(values, formik) {
    const { errors } = await setPassword({
      variables: {
        input: values,
      },
    });

    if (errors) {
      const errorCode = errors?.[0]?.extensions?.code;
      formik.setStatus(errorCode);
      formik.setSubmitting(false);
      return;
    }
  }

  return (
    <Box py={12}>
      <Card
        mx="auto"
        maxWidth="500px"
        p={["0", "10"]}
        elevation={["none", "m"]}
        variant={["ghost", "white"]}
        borderRadius="12px"
      >
        <Text
          as="h3"
          mb="1"
          fontSize="4xl"
          color="neutral900"
          fontWeight="medium"
          letterSpacing="-0.04rem"
        >
          Please set a password
        </Text>
        <Text fontSize="l" color="neutral700" mb="6" letterSpacing="-0.01rem">
          Set a password for your Adivsable account.
        </Text>
        <Formik
          validateOnMount
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        >
          {(formik) => (
            <Form>
              <FormField
                type="password"
                name="password"
                label="Password"
                marginBottom="8"
                placeholder="Password"
              />
              <FormField
                type="password"
                name="passwordConfirmation"
                label="Confirm password"
                marginBottom="8"
                placeholder="Confirm password"
              />
              <SubmitButton disableUntilValid size="l" width="100%">
                Set Password
              </SubmitButton>
              {formik.status && (
                <Box
                  mt="3"
                  bg="red100"
                  padding="3"
                  fontSize="s"
                  color="red600"
                  borderRadius="12px"
                >
                  {t(`errors.${formik.status}`)}
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </Card>
    </Box>
  );
}
