import React from "react";
import styled from "styled-components";
import { InboxIn } from "@styled-icons/heroicons-solid/InboxIn";
import { theme } from "@advisable/donut";

const StyledInboxButtonLabel = styled.div`
  font-size: 14px;
  color: ${theme.colors.neutral700};
`;

const StyledInboxButtonIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  border-radius: 50%;
  margin-bottom: 8px;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.blue900};
  background: ${theme.colors.neutral100};
  transition: background 300ms;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StyledInboxButton = styled.div`
  cursor: pointer;
  align-items: center;
  display: inline-flex;
  flex-direction: column;

  &:hover {
    ${StyledInboxButtonIcon} {
      color: ${theme.colors.neutral600};
      background: ${theme.colors.neutral200};
    }
  }
`;

export default function MoveToInboxButton() {
  const handleClick = () => {};

  return (
    <StyledInboxButton onClick={handleClick}>
      <StyledInboxButtonIcon>
        <InboxIn />
      </StyledInboxButtonIcon>
      <StyledInboxButtonLabel>Inbox</StyledInboxButtonLabel>
    </StyledInboxButton>
  );
}
