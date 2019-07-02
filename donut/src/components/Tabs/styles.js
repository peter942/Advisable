import styled, { css } from "styled-components";
import {
  Tab as ReachTab,
  Tabs as ReachTabs,
  TabList as ReachTabList,
  TabPanel as ReachTabPanel,
  TabPanels as ReachTabPanels,
} from "@reach/tabs";
import theme from "../../theme";
import { space } from "styled-system";

let colors = theme.colors;

export const Tabs = styled(ReachTabs)``;

export const TabPanels = styled(ReachTabPanels)``;

export const TabPanel = styled(ReachTabPanel)`
  outline: none;
`;

export const TabList = styled(ReachTabList)`
  ${space};

  z-index: 2;
  position: relative;
  border-bottom: 1px solid ${colors.neutral[1]};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

// Additional styles for the tab when it is selected.
const selectedTab = css`
  cursor: default;
  color: ${colors.blue[5]};
  border-color: ${colors.blue[5]};

  &:hover {
    color: ${colors.blue[5]};
    border-color: ${colors.blue[5]};
  }
`;

export const Tab = styled(ReachTab)`
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  font-size: 15px;
  cursor: pointer;
  appearance: none;
  margin-right: 20px;
  margin-bottom: -1px;
  align-items: center;
  display: inline-flex;
  padding-bottom: 12px;
  background: transparent;
  color: ${colors.neutral[4]};
  font-family: poppins, sans-serif;
  border-bottom: 1px solid transparent;
  transition: color 300ms;

  &:hover {
    color: ${colors.neutral[8]};
  }

  ${props => props.isSelected && selectedTab};

  &:first-child {
    padding-left: 0;
  }

  svg {
    margin-right: 2px;
    margin-bottom: -1px;
  }
`;

export default Tabs;
