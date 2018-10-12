import React from "react";
import { rgba } from "polished";
import styled, { keyframes, css } from "styled-components";
import { withSpacing } from "./Spacing";

const heights = {
  s: "30px",
  m: "34px",
  l: "38px",
  xl: "44px"
};

const mobileHeights = {
  s: "38px",
  m: "42px",
  l: "48px",
  xl: "54px"
};

const fontSizes = {
  s: "14px",
  m: "15px",
  l: "16px",
  xl: "16px"
};

const padding = {
  s: "0 15px",
  m: "0 16px",
  l: "0 25px",
  xl: "0 30px"
};

// STYLES defines the various styles for buttons. The style for a button can be
// selected with the 'styling' prop.
// <Button styling='outlined'>Click me</Button>
const STYLES = {
  default: css`
    color: white;
    background: #4c496a;
  `,
  outlined: css`
    color: #4c576a;
    background: transparent;
    border: 1px solid #c8cee3;

    svg {
      stroke: #8d93b6;
    }

    &:hover {
      border-color: #b0b7cf;
    }

    &:active {
      border-color: #d7ddf3;
    }
  `,
  danger: css`
    color: white;
    background: #f41f52;
  `
};

export const ButtonStyling = styled.button`
  position: relative;
  margin: 0;
  height: ${props => heights[props.size] || heights["m"]};
  border: none;
  outline: none;
  font-size: ${props => fontSizes[props.size] || fontSizes["m"]};
  padding: ${props => padding[props.size] || padding["m"]};
  opacity: ${props => (props.disabled ? "0.5" : "1")};
  cursor: pointer;
  font-weight: 500;
  border-radius: 5px;
  letter-spacing: -0.02em;
  -webkit-appearance: none;
  align-items: center;
  justify-content: center;
  width: ${props => (props.block ? "100%" : "auto")};
  display: ${props => (props.block ? "flex" : "inline-flex")};
  transition: box-shadow 0.2s, background 0.2s;

  ${props => STYLES[props.styling || "default"]}

  @media (max-width: 768px) {
    height: ${props => mobileHeights[props.size] || mobileHeights["m"]};
  }

  svg {
    margin-right: 6px !important;
  }

  ${props =>
    props.blank &&
    css`
      color: #7d8db0;
      background: white;
      border: 1px solid #d1d7e0;

      &:hover {
        color: #63749a;
        background: white;
        border-color: #b3bdca;
      }

      &:active {
        color: #3e4b68;
        background: white;
      }
    `}

  ${props =>
    props.primary &&
    `
    background: #1A5FFF;

    &:hover {
      background: #3270FF;
    }

    &:active {
      background: #0C4EE4;
      transition: none;
    }
  `}

  ${props =>
    props.loading &&
    css`
      color: transparent !important;
    `}
`;

const ButtonLoading = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const loadingDot = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
`;

const ButtonInner = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonLoadingDot = styled.div`
  opacity: 0;
  width: 6px;
  height: 6px;
  margin: 0 4px;
  background: white;
  border-radius: 50%;
  display: inline-block;
  animation: ${loadingDot} 1s infinite;

  &:nth-child(2) {
    animation-delay: 100ms;
  }
  &:nth-child(3) {
    animation-delay: 200ms;
  }
`;

const Loading = () => (
  <ButtonLoading>
    <ButtonLoadingDot />
    <ButtonLoadingDot />
    <ButtonLoadingDot />
  </ButtonLoading>
);

const ButtonWithSpacing = withSpacing(ButtonStyling);

export default ({ loading, children, ...props }) => (
  <ButtonWithSpacing loading={loading} {...props}>
    {loading && <Loading />}
    <ButtonInner>{children}</ButtonInner>
  </ButtonWithSpacing>
);
