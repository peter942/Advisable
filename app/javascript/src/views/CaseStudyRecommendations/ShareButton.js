import React from "react";
import styled from "styled-components";
import { Upload } from "@styled-icons/heroicons-solid/Upload";
import { theme } from "@advisable/donut";

const StyledShareButtonLabel = styled.div`
  font-size: 13px;
  color: ${theme.colors.neutral700};
`;

const StyledSahreButtonIcon = styled.div`
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

const StyledShareButton = styled.div`
  width: 60px;
  cursor: pointer;
  align-items: center;
  display: inline-flex;
  flex-direction: column;

  &:hover {
    ${StyledSahreButtonIcon} {
      color: ${theme.colors.neutral600};
      background: ${theme.colors.neutral200};
    }
  }
`;

export default function ShareButton() {
  const handleClick = async () => {};

  return (
    <StyledShareButton onClick={handleClick}>
      <StyledSahreButtonIcon>
        <Upload />
      </StyledSahreButtonIcon>
      <StyledShareButtonLabel>Share</StyledShareButtonLabel>
    </StyledShareButton>
  );
}
