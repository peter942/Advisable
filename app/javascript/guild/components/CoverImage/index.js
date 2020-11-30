import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useImage } from "react-image";
import styled from "styled-components";
import PostImages from "@guild/components/PostImages";
import { Box, Skeleton } from "@advisable/donut";

const StyledCoverImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Cover = ({ srcList }) => {
  const { src } = useImage({ srcList });
  return <StyledCoverImage src={src} />;
};

export const CoverImage = ({ height = "320px", images, cover }) => {
  return (
    <Suspense
      fallback={<Skeleton height="100%" width="100%" borderRadius="4px" />}
    >
      <Box
        position="relative"
        height={height}
        width="100%"
        display="inline-flex"
      >
        <ErrorBoundary FallbackComponent={() => null}>
          <Cover srcList={cover} />
        </ErrorBoundary>
        {images && <PostImages images={images} />}
      </Box>
    </Suspense>
  );
};
