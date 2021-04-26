import { rgba } from "polished";
import styled from "styled-components";
import {
  position,
  compose,
  space,
  layout,
  border,
  variant,
  typography,
} from "styled-system";
import theme from "../../theme";

const elevation = variant({
  prop: "elevation",
  variants: {
    none: {
      boxShadow: "none",
    },
    s: {
      boxShadow: `0 2px 4px ${rgba(theme.colors.neutral900, 0.12)}`,
    },
    m: {
      boxShadow: `0 8px 16px ${rgba(theme.colors.neutral900, 0.08)}`,
    },
    l: {
      boxShadow: `0px 20px 80px rgba(26, 35, 67, 0.12)`,
    },
    xl: {
      boxShadow: `0 8px 60px ${rgba(
        theme.colors.neutral900,
        0.2,
      )}, 0 2px 8px ${rgba(theme.colors.neutral900, 0.1)}`,
    },
  },
});

const cardType = variant({
  variants: {
    white: {
      background: "white",
    },
    ghost: {
      background: "transparent",
    },
    bordered: {
      background: "transparent",
      border: "1px solid #E1E2E9",
    },
  },
});

export const StyledCard = styled.div`
  ${compose(position, space, layout, border, elevation, typography)};

  outline: none;
  display: block;
  background: white;

  ${cardType};
`;

StyledCard.defaltProps = {
  borderRadius: "2px",
};

export default StyledCard;
