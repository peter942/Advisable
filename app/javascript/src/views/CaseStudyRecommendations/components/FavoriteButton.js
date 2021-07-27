import React from "react";
import styled from "styled-components";
import { Bookmark } from "@styled-icons/heroicons-solid/Bookmark";
import { theme } from "@advisable/donut";
import { useFavorite } from "../queries";

const StyledShareButtonLabel = styled.div`
  font-size: 13px;
  color: ${theme.colors.neutral700};
`;

const StyledShareButtonIcon = styled.div`
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
    ${StyledShareButtonIcon} {
      color: ${theme.colors.neutral600};
      background: ${theme.colors.neutral200};
    }
  }

  &[data-active="true"] {
    ${StyledShareButtonIcon} {
      color: white;
      background: ${theme.colors.yellow500};
    }
  }
`;

export default function FavoriteButton({ article }) {
  const [favorite] = useFavorite({
    article,
  });

  const handleClick = async () => {
    favorite();
  };

  return (
    <StyledShareButton data-active={article.isSaved} onClick={handleClick}>
      <StyledShareButtonIcon>
        <Bookmark />
      </StyledShareButtonIcon>
      <StyledShareButtonLabel>
        {article.isSaved ? "Favorited" : "Favorite"}
      </StyledShareButtonLabel>
    </StyledShareButton>
  );
}
