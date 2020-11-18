import React from "react";
import { Formik, Form, Field } from "formik";
import { ArrowLeft, ArrowRight } from "@styled-icons/feather";
import useLocationStages from "@advisable-main/hooks/useLocationStages";
import { Box, Link } from "@advisable/donut";
import SubmitButton from "@advisable-main/components/SubmitButton";
import { yourPostValidationSchema } from "./validationSchemas";
import PostTitle from "./PostTitle";
import RichTextEditor from "../RichTextEditor";

const YourPost = ({ guildPost, onSubmit, initialValues = {} }) => {
  const { pathWithState } = useLocationStages();

  const yourPostInitialValues = {
    title: "",
    body: "",
    ...initialValues,
  };

  const handleSubmit = async (values, actions) => {
    const { errors } = await onSubmit(values);
    if (errors) {
      /*
        This is a fallback in case the yup schema does not have parity w/ the server.
        INVALID_REQUEST response is not keyed by the resepctive attribute name.
      */
      errors.forEach(({ message }) => {
        const errorKey = message[0].toLowerCase();
        actions.setFieldError(errorKey, message);
      });
      actions.setSubmitting(false);
    }
  };

  return (
    <Box display="flex">
      <Box flexGrow={1} width="100%">
        <Link
          mb="s"
          fontSize="l"
          fontWeight="medium"
          to={pathWithState(`/composer/${guildPost.id}/type`)}
        >
          <Box display="inline-block" mr="xxs">
            <ArrowLeft size={20} strokeWidth={2} />
          </Box>
          Back
        </Link>
        <Formik
          validateOnMount
          onSubmit={handleSubmit}
          initialValues={yourPostInitialValues}
          validationSchema={yourPostValidationSchema}
        >
          {(formik) => (
            <Form>
              <Field
                name="title"
                as={PostTitle}
                autoComplete="off"
                placeholder="Post title"
                autoFocus
              />
              <Box height="1px" bg="neutral100" marginY="xl" />
              <RichTextEditor
                value={formik.values.body}
                onChange={(raw) => formik.setFieldValue("body", raw)}
              />
              <SubmitButton
                size="l"
                marginY="3xl"
                disableUntilValid
                suffix={<ArrowRight />}
                loading={formik.isSubmitting}
              >
                Continue
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default YourPost;
