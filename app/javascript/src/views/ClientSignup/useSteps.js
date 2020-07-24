import React, { useMemo, useCallback } from "react";
import { Route, matchPath, useLocation, Redirect } from "react-router-dom";
import { findIndex } from "lodash-es";

function useSteps(steps) {
  const location = useLocation();

  const activeSteps = useMemo(() => steps.filter((step) => !step.passive), [
    steps,
  ]);
  const passiveSteps = useMemo(() => steps.filter((step) => step.passive), [
    steps,
  ]);

  // STEPS search methods
  const matchStepPath = useCallback(
    (step) =>
      matchPath(location.pathname, {
        path: step.path,
        exact: step.exact,
        strict: step.strict,
      }),
    [location],
  );
  const currentStepIndex = useMemo(() => findIndex(steps, matchStepPath), [
    matchStepPath,
    steps,
  ]);
  const currentActiveStepIndex = useMemo(
    () => findIndex(activeSteps, matchStepPath),
    [activeSteps, matchStepPath],
  );
  const numberOfSteps = steps.length;
  const numberOfActiveSteps = activeSteps.length;
  const nextStep = useMemo(() => steps[currentStepIndex + 1], [
    currentStepIndex,
    steps,
  ]);
  const prevStep = useMemo(() => steps[currentStepIndex - 1], [
    currentStepIndex,
    steps,
  ]);

  // Redirect with component
  const RedirectToInitialStep = useCallback(
    () => <Redirect push to={steps[0].path} />,
    [steps],
  );
  const RedirectToNextStep = useCallback(
    ({ state }) => <Redirect push to={{ pathname: nextStep.path, state }} />,
    [nextStep],
  );
  const RedirectToLastStep = useCallback(
    ({ state }) => (
      <Redirect
        push
        to={{ pathname: activeSteps[activeSteps.length - 1].path, state }}
      />
    ),
    [activeSteps],
  );

  // Route components for React Router
  const routes = useMemo(
    () =>
      steps.map((step, index) => (
        <Route key={index} path={step.path} exact={step.exact}>
          <step.component
            RedirectToInitialStep={RedirectToInitialStep}
            RedirectToNextStep={RedirectToNextStep}
            RedirectToLastStep={RedirectToLastStep}
          />
        </Route>
      )),
    [RedirectToInitialStep, RedirectToLastStep, RedirectToNextStep, steps],
  );

  return {
    nextStep,
    prevStep,
    numberOfSteps,
    numberOfActiveSteps,
    RedirectToInitialStep,
    RedirectToNextStep,
    RedirectToLastStep,
    routes,
    currentStepIndex,
    currentActiveStepIndex,
  };
}

export default useSteps;
