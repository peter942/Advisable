import * as React from "react";
import { HelpCircle, ArrowRight } from "@styled-icons/feather";
import { useMutation } from "@apollo/react-hooks";
import { Formik, Form, Field } from "formik";
import { Box, Link, Text, Tooltip, Checkbox, Card } from "@advisable/donut";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { TextField } from "../../../components";
import SubmitButton from "../../../components/SubmitButton";
import SUBMIT_APPLICATION from "../submitApplication";
import UPDATE_APPLICATION from "../updateApplication";
import validationSchema from "./validationSchema";

const numberMask = createNumberMask({ prefix: "" });

function Terms({ match, history, application, steps, currentStep, location }) {
  const [updateApplication] = useMutation(UPDATE_APPLICATION);
  const [submitApplication] = useMutation(SUBMIT_APPLICATION);

  let applicationId = match.params.applicationId;
  let locationState = location.state || {};

  const handleSubmit = async (values) => {
    await updateApplication({
      variables: {
        input: {
          ...values,
          id: applicationId,
        },
      },
    });

    if (locationState.allowApply || application.status === "Invited To Apply") {
      await submitApplication({
        variables: {
          input: {
            id: applicationId,
          },
        },
      });
    }

    let pathname = `/invites/${applicationId}/apply/sent`;
    history.push({ ...location, pathname });
  };

  const initialValues = {
    rate: parseFloat(application.rate) || "",
    acceptsFee: application.acceptsFee,
    acceptsTerms: application.acceptsTerms,
    trialProgram: application.trialProgram || false,
    autoApply: false,
  };

  return (
    <Card>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <Form>
            <Box padding={{ _: "l", m: "xl" }}>
              <Text
                as="h1"
                mb="l"
                fontSize="30px"
                color="blue.9"
                fontWeight="semibold"
                letterSpacing="-0.04em"
              >
                Payment Terms
              </Text>
              <Box mb="l">
                <Field
                  prefix="$"
                  name="rate"
                  as={TextField}
                  mask={numberMask}
                  error={formik.touched.rate && formik.errors.rate}
                  label="Including Advisable's fee, what's your estimated hourly rate for projects like this?"
                  placeholder="0"
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      const amount = Number(e.target.value.replace(/\,/, ""));
                      formik.setFieldValue("rate", amount);
                    } else {
                      formik.setFieldValue("rate", null);
                    }
                  }}
                />
              </Box>
              <Field as={Checkbox} type="checkbox" name="autoApply" mb="m">
                I would like to automatically be applied to similar projects
                using the data I just provided
              </Field>
              <Box mb="m">
                <Field
                  as={Checkbox}
                  type="checkbox"
                  name="acceptsFee"
                  error={formik.touched.acceptsFee && formik.errors.acceptsFee}
                >
                  <Text lineHeight="m" fontSize="s">
                    I agree that if Advisable connects me to a client that I
                    successfully contract with, between 5-20% of my fees are
                    payable to Advisable and all payments must go through
                    Advisable.
                  </Text>
                  <Tooltip
                    content={
                      <>
                        <Text color="white" size="xs" lineHeight="xs" mb="m">
                          In order to facilitate fair long-term outcomes,
                          Advisable's fee to freelancers is reduced for larger
                          relationships between Freelancer and Client
                        </Text>
                        <Text color="white" size="xs" lineHeight="xs">
                          For the first $10,000, our fee is 20%
                        </Text>
                        <Text color="white" size="xs" lineHeight="xs">
                          From $10,000-25,000, our fee is 10%
                        </Text>
                        <Text color="white" size="xs" lineHeight="xs">
                          For $25,000+, our fee is 5%
                        </Text>
                      </>
                    }
                  >
                    <Box pt="xs" display="flex" alignItems="center">
                      <Box
                        mr="xxs"
                        color="neutral700"
                        strokeWidth={1.5}
                        size={20}
                      >
                        <HelpCircle />
                      </Box>
                      More Information
                    </Box>
                  </Tooltip>
                </Field>
              </Box>
              <Box mb="m">
                <Field
                  as={Checkbox}
                  type="checkbox"
                  name="acceptsTerms"
                  error={
                    formik.touched.acceptsTerms && formik.errors.acceptsTerms
                  }
                >
                  I agree with{" "}
                  <Link
                    as="a"
                    href=" https://www.advisable.com/freelancer-agreement/"
                    target="_blank"
                  >
                    Advisable's freelancer agreement.
                  </Link>
                </Field>
              </Box>
              <Box>
                <Field
                  as={Checkbox}
                  type="checkbox"
                  name="trialProgram"
                  error={
                    formik.touched.trialProgram && formik.errors.trialProgram
                  }
                >
                  I agree to participate in{" "}
                  <Tooltip
                    interactable
                    content={
                      <>
                        Advisable offers clients a trial period of up to 8 hours
                        when working with a new freelancer. You will be paid for
                        work completed during this trial as long as the client
                        agrees you adhered to{" "}
                        <Link
                          as="a"
                          display="inline"
                          href="https://advisable.com/professional-standards"
                          target="_blank"
                        >
                          Advisable's Professional Standards
                        </Link>
                      </>
                    }
                  >
                    <Link
                      as="a"
                      target="_blank"
                      href="https://advisable.com/freelancer-trial"
                    >
                      Advisable's Guaranteed Trial Programme.
                    </Link>
                  </Tooltip>
                </Field>
              </Box>

              <SubmitButton mt="xl" size="l" suffix={<ArrowRight />}>
                Submit Application
              </SubmitButton>
            </Box>
          </Form>
        )}
      </Formik>
    </Card>
  );
}

export default Terms;
