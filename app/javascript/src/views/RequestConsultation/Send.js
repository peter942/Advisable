import React from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Card, Box, Text, Button } from "@advisable/donut";
import ScaleInput from "../../components/ScaleInput";
import { useNotifications } from "src/components/Notifications";
import { useSendConsultation } from "./queries";

function Send({ data }) {
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const { error } = useNotifications();
  const [send] = useSendConsultation();

  const initialValues = {
    likelyToHire: null,
  };

  const handleSubmit = async (values) => {
    const { errors } = await send({
      variables: {
        input: {
          consultation: location.state.consultationId,
          ...values,
        },
      },
    });

    if (errors) {
      error("Something went wrong, please try again");
    } else {
      history.push({
        pathname: `/request_consultation/${params.specialistId}/sent`,
        state: {
          ...location.state,
          completed: [...(location?.state?.completed || []), "SEND"],
        },
      });
    }
  };

  return (
    <Card borderRadius="12px" padding={[4, 6, 8]}>
      <Text
        mb={6}
        as="h2"
        fontSize="4xl"
        fontWeight="600"
        color="neutral900"
        letterSpacing="-0.05rem"
      >
        If you&apos;re impressed by {data.specialist.firstName}, how likely are
        you to hire them as a freelancer?
      </Text>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            <Box mb="xl">
              <Field
                as={ScaleInput}
                name="likelyToHire"
                onChange={(v) => {
                  formik.setFieldValue("likelyToHire", v);
                }}
              />
            </Box>
            <Button
              type="submit"
              loading={formik.isSubmitting}
              disabled={!formik.values.likelyToHire}
            >
              Request Consultation
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}

export default Send;
