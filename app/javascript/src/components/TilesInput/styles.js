import styled from "styled-components";
import { variant } from "styled-system";
import { theme } from "@advisable/donut";

const size = variant({
  prop: "size",
  variants: {
    m: {
      minHeight: "48px",
    },
    l: {
      minHeight: "64px",
    },
  },
});

const StyledTilesInputOption = styled.button`
  ${size}

  display: flex;
  flex-direction: column;
  justify-content: center;

  align-items: center;
  border: none;
  padding: 12px 4px;
  outline: none;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  appearance: none;
  border-radius: 12px;
  color: ${theme.colors.neutral500};
  background: #eff0f3;
  box-shadow: inset 0px 0px 0px 0px ${theme.colors.blue500};

  & span {
    color: ${theme.colors.neutral600};
  }

  &:hover {
    box-shadow: inset 0px 0px 0px 2px ${theme.colors.neutral200};
  }

  &[data-selected="true"] {
    color: ${theme.colors.blue900};
    transition: 0.3s box-shadow, 0.3s background;
    background: ${theme.colors.blue100};
    box-shadow: inset 0px 0px 0px 2px ${theme.colors.blue900};
  }

  &[data-selected="true"] span {
    color: ${theme.colors.blue900};
  }
`;

StyledTilesInputOption.defaultProps = {
  size: "l",
};

export default StyledTilesInputOption;
