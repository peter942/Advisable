import { rgba } from "polished";
import styled from "styled-components";
import theme from "../../theme";
import { Menu as ReakitMenu, MenuItem as ReakitMenuItem } from "reakit";

export const StyledMenu = styled(ReakitMenu)`
  padding: 8px;
  color: white;
  border: none;
  outline: none;
  user-select: none;
  position: absolute;
  white-space: normal;
  border-radius: 12px;
  font-family: TTHoves, sans-serif;
  background: ${theme.colors.neutral800};
  width: ${(props) => props.width || "250px"};
  box-shadow: 0px 4px 40px ${rgba(theme.colors.neutral800, 0.2)};
`;

export const StyledMenuItem = styled(ReakitMenuItem)`
  margin: 0;
  width: 100%;
  color: white;
  border: none;
  outline: none;
  display: block;
  text-align: left;
  appearance: none;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  background: transparent;
  font-family: TTHoves, sans-serif;

  &:focus {
    background: ${theme.colors.neutral600};
  }

  &[disabled] {
    color: ${theme.colors.neutral300};
  }
`;
