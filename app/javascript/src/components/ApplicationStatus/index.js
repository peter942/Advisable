// Renders the status for a given application. The colour of the status is
// dependent of the application status.

import React from "react";
import Status from "../Status";

const COLOURS = {
  Applied: "green",
  Offered: "yellow",
  "Application Accepted": "yellow",
  Proposed: "yellow",
};

const ApplicationStatus = ({ children }) => {
  return <Status styling={COLOURS[children]}>{children}</Status>;
};

export default ApplicationStatus;
