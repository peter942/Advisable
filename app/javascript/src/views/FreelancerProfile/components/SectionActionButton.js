import React from "react";
import { Box } from "@advisable/donut";
import css from "@styled-system/css";
import styled from "styled-components";
import { space } from "styled-system";

const StyledAddButton = styled(Box)(
  space,
  css({
    backgroundColor: "white",
    width: "100%",
    display: "flex",
    userSelect: "none",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20px",
    color: "neutral500",
    fontSize: "18px",
    fontWeight: 450,
    cursor: "pointer",
    border: "2px solid transparent",
    borderColor: "neutral100",
    transition:
      "border-color 200ms, box-shadow 200ms, color 200ms, transform 200ms",

    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: "neutral200",
      boxShadow: "0 8px 24px -8px rgba(0, 0, 0, 0.12)",
      color: "neutral600",
    },
  }),
);

export default function SectionActionButton(props) {
  return <StyledAddButton role="button" {...props} />;
}
