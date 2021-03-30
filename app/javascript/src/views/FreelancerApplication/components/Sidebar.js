import React from "react";
import { Card, Text } from "@advisable/donut";
import MultistepMenu from "src/components/MultistepMenu";
import { validationSchema as introductionValidationSchema } from "../steps/Introduction";
import { validationSchema as overviewValidationSchema } from "../steps/Overview";
import { validationSchema as idealProjectValidationSchema } from "../steps/IdealProject";
import { validationSchema as previousWorkValidationSchema } from "../steps/PreviousWork";
import { validationSchema as WorkPreferencesValidationSchema } from "../steps/WorkPreferences";

export default function Sidebar({ specialist }) {
  const introductionComplete = introductionValidationSchema.isValidSync({
    ...specialist,
    country: specialist.country?.id,
  });
  const overviewComplete = overviewValidationSchema.isValidSync(specialist);
  const previousWorkComplete = previousWorkValidationSchema.isValidSync(
    specialist,
  );
  const workPreferencesComplete = WorkPreferencesValidationSchema.isValidSync(
    specialist,
  );
  const idealProjectComplete = idealProjectValidationSchema.isValidSync(
    specialist,
  );

  return (
    <Card
      top="0"
      left="0"
      padding={6}
      width="300px"
      height="100vh"
      position="fixed"
      paddingTop="60px"
      borderRadius="0px"
    >
      <Text
        color="neutral400"
        textTransform="uppercase"
        fontWeight="medium"
        fontSize="2xs"
        mb={4}
        mt={6}
      >
        Application
      </Text>
      <MultistepMenu>
        <MultistepMenu.Item
          to="/freelancers/apply/introduction"
          isComplete={introductionComplete}
        >
          Introduction
        </MultistepMenu.Item>
        <MultistepMenu.Item
          to="/freelancers/apply/overview"
          isComplete={overviewComplete}
          isDisabled={!introductionComplete && !overviewComplete}
        >
          Overview
        </MultistepMenu.Item>
        <MultistepMenu.Item
          to="/freelancers/apply/experience"
          isComplete={previousWorkComplete}
          isDisabled={!overviewComplete && !previousWorkComplete}
        >
          Previous work
        </MultistepMenu.Item>
        <MultistepMenu.Item
          to="/freelancers/apply/preferences"
          isComplete={workPreferencesComplete}
          isDisabled={!previousWorkComplete && !workPreferencesComplete}
        >
          Work preferences
        </MultistepMenu.Item>
        <MultistepMenu.Item
          to="/freelancers/apply/ideal_project"
          isComplete={idealProjectComplete}
          isDisabled={!workPreferencesComplete && !idealProjectComplete}
        >
          Ideal project
        </MultistepMenu.Item>
      </MultistepMenu>
    </Card>
  );
}
