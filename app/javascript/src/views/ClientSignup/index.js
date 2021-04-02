import React from "react";
import { Switch, Redirect } from "react-router-dom";
import useViewer from "../../hooks/useViewer";
import useSteps from "src/hooks/useSteps";
import steps from "./Steps";
import Testimonials from "./Testimonials";
import { Box, useTheme, useBreakpoint } from "@advisable/donut";
import { Step } from "./styles";
import Progress from "./Progress";
import { useNotifications } from "src/components/Notifications";

function ClientSignup() {
  const { routes, currentActiveStepIndex, numberOfActiveSteps } = useSteps(
    steps,
  );
  const viewer = useViewer();
  const theme = useTheme();
  const isDesktop = useBreakpoint("lUp");
  const notifications = useNotifications();

  React.useLayoutEffect(() => {
    theme.updateTheme({ background: "white" });
    return () => theme.updateTheme({ background: "default" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (viewer) {
    notifications.notify("You have an account and already signed in");
    return <Redirect to="/" />;
  }

  const currentStepNumber = currentActiveStepIndex;
  const numberOfSteps = numberOfActiveSteps - 1;
  const progressLength = (currentStepNumber / numberOfSteps) * 100;

  return (
    <Box display="flex" flexDirection="row">
      {isDesktop && <Testimonials />}
      <Box
        ml={isDesktop ? "calc(40% + 3%)" : "auto"}
        py={["l", "4%"]}
        maxWidth={600}
        width="100%"
        mr="auto"
        px="m"
      >
        {currentStepNumber !== -1 && (
          // Show steps only for active steps
          <>
            <Step>
              Step {currentStepNumber} of {numberOfSteps}
            </Step>
            <Progress amount={progressLength} />
          </>
        )}
        <Switch>{routes}</Switch>
      </Box>
    </Box>
  );
}

export default ClientSignup;
