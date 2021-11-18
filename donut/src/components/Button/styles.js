import { rgba } from "polished";
import styled, { css, keyframes } from "styled-components";
import theme from "../../theme";
import { margin, layout, variant } from "styled-system";

const spin = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(359deg);
  }
`;

export const StyledButtonPrefix = styled.div`
  align-items: center;
  display: inline-flex;
`;

export const StyledButtonSuffix = styled.div`
  align-items: center;
  display: inline-flex;
`;

export const Loading = styled.div`
  top: 50%;
  left: 50%;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: ${spin} 700ms linear infinite;
  transform: translate(-50%, -50%) rotate(0deg);
`;

const primaryStyles = css`
  background: #3f3cff;

  &:not(:disabled):hover {
    background: #5d59ff;
  }

  &:not(:disabled):active {
    background: #3330d3;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const solidGradientStyles = css`
  background: linear-gradient(108.83deg, #9423ed -10%, #2350ed 120.66%);

  &:not(:disabled):hover {
    background: linear-gradient(108.83deg, #b230f6 -39.74%, #2a61f6 120.66%);
  }

  &:not(:disabled):active {
    background: linear-gradient(108.83deg, #9423ed -10%, #2350ed 120.66%);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const secondaryStyles = css`
  background: ${theme.colors.neutral900};

  &:not(:disabled):hover {
    background: ${theme.colors.neutral800};
  }

  &:not(:disabled):active {
    background: ${theme.colors.neutral700};
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &[disabled]:not([data-loading="true"]) {
    opacity: 0.4;
  }
`;

export const VARIANTS = {
  primary: primaryStyles,
  gradient: solidGradientStyles,
  secondary: secondaryStyles,
  dark: secondaryStyles, // deprecated: use secondary variant instead
  subtle: css`
    color: ${theme.colors.blue700};
    background: ${theme.colors.blue50};

    &:not(:disabled):hover {
      color: ${theme.colors.blue900};
      background: ${theme.colors.blue100};
    }

    &:not(:disabled):active {
      color: ${theme.colors.blue900};
      background: ${theme.colors.blue100};
    }

    ${Loading} {
      color: #242473;
    }
  `,
  ghost: css`
    color: ${theme.colors.neutral500};

    &:not(:disabled):hover {
      color: ${theme.colors.neutral700};
      background: ${rgba(theme.colors.blue500, 0.04)};
    }

    &:not(:disabled):active {
      background: ${rgba(theme.colors.blue900, 0.08)};
    }

    ${Loading} {
      color: ${theme.colors.blue600};
    }

    &[data-loading="true"] {
      background: ${rgba("#3f3bff", 0.04)};
    }
  `,
  minimal: css`
    padding: 2px 0;
    height: auto;
    color: ${theme.colors.neutral500};

    &:not(:disabled):hover {
      color: ${theme.colors.neutral800};
    }

    &:not(:disabled):active {
      color: ${theme.colors.neutral400};
    }
  `,
  outlined: css`
    background: transparent;
    color: ${theme.colors.neutral700};
    border: 1px solid ${theme.colors.neutral500};

    &:not(:disabled):hover {
      color: ${theme.colors.neutral900};
      border-color: ${theme.colors.neutral900};
    }

    &:not(:disabled):active {
      color: ${theme.colors.neutral600};
      border-color: ${theme.colors.neutral600};
    }

    ${Loading} {
      color: #242473;
    }
  `,
};

const buttonSize = variant({
  prop: "$buttonSize",
  variants: {
    xs: {
      height: "28px",
      lineHeight: "28px",
      fontSize: 14,
      fontWeight: 500,
      paddingLeft: 3,
      paddingRight: 3,
      svg: {
        width: 16,
        height: 16,
      },
      [StyledButtonPrefix]: {
        marginRight: "2px",
      },
      [StyledButtonSuffix]: {
        marginLeft: "2px",
      },
    },
    s: {
      height: "36px",
      lineHeight: "36px",
      fontSize: 16,
      fontWeight: 500,
      paddingLeft: "16px",
      paddingRight: "16px",
      svg: {
        width: 16,
        height: 16,
      },
      [StyledButtonPrefix]: {
        marginRight: "8px",
      },
      [StyledButtonSuffix]: {
        marginLeft: "8px",
      },
    },
    m: {
      height: "40px",
      fontSize: 17,
      lineHeight: "40px",
      fontWeight: 500,
      paddingLeft: "16px",
      paddingRight: "16px",
      svg: {
        width: 20,
        height: 20,
      },
      [StyledButtonPrefix]: {
        marginRight: "8px",
      },
      [StyledButtonSuffix]: {
        marginLeft: "8px",
      },
    },
    l: {
      height: "48px",
      fontSize: 18,
      lineHeight: "48px",
      fontWeight: 500,
      paddingLeft: 24,
      paddingRight: 24,
      svg: {
        width: 24,
        height: 24,
      },
      [StyledButtonPrefix]: {
        marginRight: "8px",
      },
      [StyledButtonSuffix]: {
        marginLeft: "8px",
      },
    },
  },
});

export const StyledButton = styled.button`
  ${margin}
  ${layout}
  ${buttonSize}

  border: none;
  color: white;
  outline: none;
  padding-top: 0;
  cursor: pointer;
  padding-bottom: 0;
  appearance: none;
  user-select: none;
  position: relative;
  border-radius: 30px;
  align-items: center;
  white-space: nowrap;
  display: inline-flex;
  text-decoration: none;
  vertical-align: middle;
  justify-content: center;
  letter-spacing: -0.01em;
  background: transparent;
  transition: background 100ms;
  font-family: TTHoves, sans-serif;
  ${(props) => props.align === "left" && { justifyContent: "flex-start" }}

  svg {
    stroke-width: 2;
  }

  &[data-loading="true"] {
    cursor: default;
    color: transparent;
  }

  &[disabled]:not([data-loading="true"]) {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${(props) => VARIANTS[props.variant || "primary"]}
`;

export default StyledButton;
