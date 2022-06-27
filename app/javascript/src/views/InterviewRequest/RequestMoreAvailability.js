import React from "react";
import { Formik, Form } from "formik";
import { Box, Text, Button, Columns, Textarea } from "@advisable/donut";
import FormField from "../../components/FormField";
import { useRequestMoreTimes } from "./queries";

export default function RequestMoreAvailability({
  onCancel,
  interviewID,
  name,
}) {
  const [requestMoreTimes, { loading }] = useRequestMoreTimes();

  const initialValues = {
    availabilityNote: "",
  };

  const handleSubmit = async (values) => {
    return requestMoreTimes({
      variables: {
        input: {
          id: interviewID,
          availabilityNote: values.availabilityNote,
        },
      },
    });
  };

  return (
    <Box padding="l">
      <Text
        mb="xs"
        as="h3"
        fontSize="xxl"
        color="blue900"
        fontWeight="semibold"
        letterSpacing="-0.02em"
      >
        Request more availability
      </Text>
      <Text mb="l" lineHeight="m" color="neutral800">
        We will request more availability from {name} and let you know when they
        respond.
      </Text>
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <Form>
          <Box mb="l">
            <FormField
              as={Textarea}
              name="availabilityNote"
              label="When suits for you?"
              placeholder="Please add a note on your availability"
            />
          </Box>
          <Columns spacing="xs">
            <Button
              width="100%"
              size="l"
              type="submit"
              variant="dark"
              loading={loading}
            >
              Request
            </Button>
            <Button
              width="100%"
              type="button"
              variant="subtle"
              size="l"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Columns>
        </Form>
      </Formik>
    </Box>
  );
}
