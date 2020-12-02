import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { space, typography, variant, color } from "styled-system";
import theme from "../../theme";

const variants = variant({
  variants: {
    default: {
      color: theme.colors.blue600,
      "&:hover": {
        color: theme.colors.blue800,
      },
    },
    dark: {
      color: theme.colors.blue900,
      "&:hover": {
        color: theme.colors.blue700,
        textDecoration: "underline",
      },
    },
    subtle: {
      color: theme.colors.neutral700,
      "&:hover": {
        color: theme.colors.blue600,
      },
    },
  },
});

// There is some funky stuff going on with the new release of react-router-dom
// not playing nicely with styled-components as prop. Because of this we have
// added a .External sub component to use non react router links.
const styles = css`
  ${space}
  ${variants}
  ${typography}
  ${color}

  outline: none;
  position: relative;
  align-items: center;
  display: ${(props) => (props.notInline ? "flex" : "inline-flex")};
  text-decoration: none;
  transition: color 200ms;

  &::after {
    content: "";
  }
`;

export const LinkStyles = styled(Link)`
  ${styles}
`;

LinkStyles.External = styled.a`
  ${styles}
`;

export default LinkStyles;
