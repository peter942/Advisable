import * as Yup from "yup";
import React from "react";
import { useMutation } from "react-apollo";
import { Formik, Form, Field } from "formik";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { Box, Checkbox, RoundedButton, Text } from "@advisable/donut";
import TextField from "../../TextField";
import UPDATE_ESTIMATE from "./updateEstimate";
import SegmentedControl from "../../SegmentedControl";
import priceInputProps from "../../../utilities/priceInputProps";
import QuoteInputPriceCalcuation from "./QuoteInputPriceCalculation";

const hourMask = createNumberMask({ prefix: "" });

const CONTENT = {
  Hourly: {
    label: "How long will this take you?",
    amountPlaceholder: "10 Hours",
    flexibleAmountPlaceholder: "20 Hours",
    flexibleToggle: "Flexible hours",
  },
  Fixed: {
    label: "How much will this project cost?",
    amountPlaceholder: "500",
    flexibleAmountPlaceholder: "1000",
    flexibleToggle: "Flexible amount",
  },
};

const validationSchema = Yup.object({
  isFlexible: Yup.boolean(),
  estimate: Yup.number().required(),
  flexibleEstimate: Yup.number().when("isFlexible", {
    is: true,
    then: Yup.number().required(),
  }),
});

const QuoteInputPopout = ({ onSuccess, onCancel, task }) => {
  const [updateEstimate] = useMutation(UPDATE_ESTIMATE);

  const initialValues = {
    isFlexible: Boolean(task.flexibleEstimate),
    estimate: task.estimate ? task.estimate : undefined,
    estimateType: task.estimateType || "Hourly",
    flexibleEstimate: task.flexibleEstimate ? task.flexibleEstimate : undefined,
  };

  const handleChangePricingType = formik => e => {
    formik.handleChange(e);
    formik.setFieldValue("estimate", undefined);
    formik.setFieldValue("flexibleEstimate", undefined);
  };

  const handleToggleFlexible = formik => e => {
    if (formik.values.isFlexible) {
      formik.setFieldValue("flexibleEstimate", undefined);
    }
    formik.handleChange(e);
  };

  const handleSubmit = async values => {
    await updateEstimate({
      variables: {
        input: {
          id: task.id,
          estimateType: values.estimateType,
          estimate: values.estimate ? Number(values.estimate) : undefined,
          flexibleEstimate: values.flexibleEstimate
            ? Number(values.flexibleEstimate)
            : null,
        },
      },
    });

    onSuccess();
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ isSubmitting, ...formik }) => (
        <Form>
          <Field
            mb="m"
            name="estimateType"
            as={SegmentedControl}
            onChange={handleChangePricingType(formik)}
            options={[
              { label: "Hourly", value: "Hourly" },
              { label: "Fixed", value: "Fixed" },
            ]}
          />
          <Text as="label" fontSize="s" htmlFor="amount" fontWeight="medium">
            {CONTENT[`${formik.values.estimateType}`].label}
          </Text>
          <Box pt="xs" display="flex" alignItems="center">
            <Box width="100%">
              <Field
                size="s"
                id="estimate"
                name="estimate"
                as={TextField}
                mask={hourMask}
                autoFocus={formik.values.estimateType !== "Fixed"}
                placeholder={
                  CONTENT[`${formik.values.estimateType}`].amountPlaceholder
                }
                {...(formik.values.estimateType === "Fixed"
                  ? priceInputProps(formik, "estimate")
                  : {})}
              />
            </Box>
            {formik.values.isFlexible && (
              <>
                <Text px="xs" color="neutral.6">
                  to
                </Text>
                <Box width="100%">
                  <Field
                    size="s"
                    as={TextField}
                    name="flexibleEstimate"
                    autoFocus
                    mask={hourMask}
                    prefix={formik.values.estimateType === "Fixed" && "$"}
                    placeholder={
                      CONTENT[`${formik.values.estimateType}`]
                        .flexibleAmountPlaceholder
                    }
                    {...(formik.values.estimateType === "Fixed"
                      ? priceInputProps(formik, "flexibleEstimate")
                      : {})}
                  />
                </Box>
              </>
            )}
          </Box>
          <QuoteInputPriceCalcuation
            task={task}
            isFlexible={formik.values.isFlexible}
            {...formik.values}
          />
          <Field
            as={Checkbox}
            mt="s"
            mb="l"
            size="s"
            type="checkbox"
            name="isFlexible"
            onChange={handleToggleFlexible(formik)}
          >
            {CONTENT[`${formik.values.estimateType}`].flexibleToggle}
          </Field>
          <RoundedButton
            mr="xs"
            size="s"
            type="submit"
            loading={isSubmitting}
            disabled={!formik.isValid}
          >
            Save Quote
          </RoundedButton>
          <RoundedButton
            type="button"
            size="s"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </RoundedButton>
        </Form>
      )}
    </Formik>
  );
};

export default QuoteInputPopout;
