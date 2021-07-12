import React from "react";
import { Formik, Form, Field } from "formik";
import SubmitButton from "src/components/SubmitButton";
import BulletPointInput from "src/components/BulletPointInput";
import CheckboxInput from "src/components/CheckboxInput";
import FormField from "src/components/FormField";
import { Text, Stack, Box } from "@advisable/donut";
import ActionBarModal from "./ActionBarModal";
import { useUpdateProject } from "./queries";

const CHARACTERISTICS = "CHARACTERISTICS";
const REQUIRED_CHARACTERISTICS = "REQUIRED_CHARACTERISTICS";

export default function UpdateProjectRequirementsModal({ dialog, project }) {
  const [step, setStep] = React.useState(CHARACTERISTICS);
  const [updateProject] = useUpdateProject();
  const initialValues = {
    characteristics: project.characteristics,
    requiredCharacteristics: project.requiredCharacteristics,
  };

  const handleSubmit = async (values, formik) => {
    if (step === CHARACTERISTICS) {
      setStep(REQUIRED_CHARACTERISTICS);

      // TODO: For now we must make sure to filter out any items from required
      // characteristics when the characteristics are updated to prevent any
      // previously selected required characteristics from sticking around.
      // Ideally we would do this in the API but we can't for now due to how the
      // old /project_setup/:id flow works.
      formik.setFieldValue(
        "requiredCharacteristics",
        project.requiredCharacteristics.filter((characteristic) => {
          return values.characteristics.includes(characteristic);
        }),
      );
    } else {
      await updateProject({
        variables: {
          input: {
            id: project.id,
            ...values,
          },
        },
      });

      setStep(CHARACTERISTICS);
      dialog.hide();
    }
  };

  return (
    <ActionBarModal width={700} dialog={dialog}>
      {dialog.visible && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(formik) => (
            <Form>
              {step === CHARACTERISTICS && (
                <>
                  <Text
                    fontSize="3xl"
                    marginBottom="xl"
                    fontWeight="medium"
                    letterSpacing="-0.02em"
                  >
                    What characteristics should this specialist have?
                  </Text>
                  <Stack spacing="xl" marginBottom="xl">
                    <Field
                      as={BulletPointInput}
                      name="characteristics"
                      placeholder={
                        project.primarySkill?.characteristicPlaceholder ||
                        "e.g Strong communication skills"
                      }
                      label="What characteristics should this specialist have?"
                      description="We'll check this list against every specialist we match you with."
                      onChange={(v) =>
                        formik.setFieldValue("characteristics", v)
                      }
                    />
                  </Stack>
                  <SubmitButton variant="dark">Next</SubmitButton>
                </>
              )}

              {step === REQUIRED_CHARACTERISTICS && (
                <>
                  <Text
                    fontSize="3xl"
                    marginBottom="xl"
                    fontWeight="medium"
                    letterSpacing="-0.02em"
                  >
                    Which of these characteristics are essential?
                  </Text>
                  <Box marginBottom="xl">
                    <FormField
                      as={CheckboxInput}
                      name="requiredCharacteristics"
                      options={formik.values.characteristics}
                    />
                  </Box>
                  <SubmitButton>Save Changes</SubmitButton>
                </>
              )}
            </Form>
          )}
        </Formik>
      )}
    </ActionBarModal>
  );
}
