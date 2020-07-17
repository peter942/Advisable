import React from "react";
import { Switch, Redirect } from "react-router-dom";
import useViewer from "../../hooks/useViewer";
import useSteps from "./useSteps";
import steps from "./Steps";
import Testimonials from "./Testimonials";
import { Box } from "@advisable/donut";
import { Step } from "./styles";
import Progress from "./Progress";

function ClientSignup() {
  const { routes, currentStepIndex } = useSteps(steps);
  const viewer = useViewer();

  if (viewer) {
    return <Redirect to="/" />;
  }

  const currentStepNumber = currentStepIndex();

  return (
    <>
      <Testimonials />
      <Box paddingRight={{ _: null, l: 550 }}>
        <Box py="xxl" maxWidth={600} margin="0 auto" px="m">
          <React.Fragment>
            <Step>
              Step {currentStepNumber} of {steps.length - 1}
            </Step>
            <Progress amount={(currentStepNumber / steps.length) * 100} />
          </React.Fragment>
          <Switch>{routes}</Switch>
        </Box>
      </Box>
    </>
  );
}

export default ClientSignup;
