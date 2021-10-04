import React from "react";
import { Box, Text, Button, Link } from "@advisable/donut";
import useLocationStages from "@advisable-main/hooks/useLocationStages";
import { ArrowLeft } from "@styled-icons/feather/ArrowLeft";
import { ArrowRight } from "@styled-icons/feather/ArrowRight";
import useImageReducer from "./useImageReducer";
import useProgressSteps from "./useProgressSteps";
import { ImageTiles } from "./Images";
import CoverPhoto from "./CoverPhoto";

export default function EditImages({ guildPost }) {
  const { pathWithState } = useLocationStages();
  const [images, dispatch] = useImageReducer(guildPost?.images);
  const { progress } = useProgressSteps();

  const nextPath = `/guild/composer/${guildPost.id}/audience`;

  const handleContinue = () => {
    progress("EDIT_IMAGES", nextPath);
  };

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <Link
          mb="s"
          fontSize="l"
          fontWeight="medium"
          to={pathWithState(`/guild/composer/${guildPost.id}/post`)}
        >
          <Box display="inline-block" mr="xxs">
            <ArrowLeft size={20} strokeWidth={2} />
          </Box>
          Back
        </Link>
        <Text mb="xs" fontSize="28px" color="blue900" fontWeight="semibold">
          Images
        </Text>
        <Text lineHeight="l" color="neutral600" mb="l">
          If you have one, please add an image or images to supplement your
          post.
        </Text>
        <Box mb="xl">
          <CoverPhoto images={images} dispatch={dispatch} resourceName="post" />
          {images.length > 0 && (
            <ImageTiles
              images={images}
              dispatch={dispatch}
              guildPostId={guildPost.id}
            />
          )}
        </Box>
        <Button
          size="l"
          mr="xs"
          onClick={handleContinue}
          suffix={<ArrowRight />}
          disabled={guildPost.images.length === 0}
        >
          Continue
        </Button>
        <Button onClick={handleContinue} variant="subtle" size="l">
          Skip
        </Button>
      </Box>
    </Box>
  );
}
