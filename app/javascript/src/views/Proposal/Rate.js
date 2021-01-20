import * as React from "react";
import { Formik, Form } from "formik";
import { useMutation } from "@apollo/client";
import { Box, Button, Card } from "@advisable/donut";
import Text from "../../components/Text";
import Heading from "../../components/Heading";
import FormField from "../../components/FormField";
import CurrencyInput from "../../components/CurrencyInput";
import currency from "../../utilities/currency";
import { rateValidationSchema } from "./validationSchema";
import UPDATE_APPLICATION from "./updateApplication.js";

const Rate = ({ history, application }) => {
  const [updateApplication] = useMutation(UPDATE_APPLICATION);

  const handleSubmit = async (values) => {
    const { errors } = await updateApplication({
      variables: {
        input: {
          id: application.id,
          rate: parseFloat(values.rate),
        },
      },
    });

    if (!errors) {
      const urlPrefix = `/applications/${application.id}/proposal`;
      history.push(`${urlPrefix}/type`);
    }
  };

  const initialValues = {
    rate: application.rate || "",
  };

  const calculateRate = (amount) => {
    const rate = (amount * 0.8).toFixed(2);
    return currency(parseFloat(rate) * 100.0);
  };

  return (
    <Card>
      <Formik
        validateOnMount
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={rateValidationSchema}
      >
        {(formik) => (
          <Form>
            <Box padding="l">
              <Box paddingBottom="s">
                <Heading level={3}>
                  What is your hourly rate for this project?
                </Heading>
              </Box>
              <Box paddingBottom="l">
                <Text size="s">
                  Advisable charge a fee of 20% of the price you charge. Please
                  remember to account for this in your hourly rate.
                </Text>
              </Box>
              <FormField
                labelHidden
                prefix="$"
                name="rate"
                marginBottom="xl"
                label="Hourly Rate"
                placeholder="$0.00"
                as={CurrencyInput}
                caption={
                  Number(formik.values.rate) > 0 &&
                  `You would earn ${calculateRate(formik.values.rate)} per hour`
                }
              />
              <Button
                type="submit"
                disabled={!formik.isValid}
                aria-label="Continue"
                loading={formik.isSubmitting ? true : undefined}
              >
                Continue
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default Rate;
