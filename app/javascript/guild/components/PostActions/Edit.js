import React from "react";
import { useHistory } from "react-router-dom";
import { useDialogState } from "reakit/Dialog";
import { Pencil } from "@styled-icons/heroicons-outline/Pencil";
import { Box, Tooltip } from "@advisable/donut";
import PostAction from "./PostAction";
import CannotChangeModal from "./CannotChangeModal";

function EditPost({ post, size }) {
  const history = useHistory();
  const modal = useDialogState();

  function handleClick() {
    post.article ? modal.show() : history.push(`/posts/${post.id}/edit`);
  }
  return (
    <>
      <CannotChangeModal modal={modal} />
      <Tooltip placement="top" content="Edit">
        <Box
          css={`
            outline: none;
          `}
        >
          <PostAction
            size={size}
            onClick={handleClick}
            bg="neutral100"
            color="neutral600"
            icon={<Pencil />}
          />
        </Box>
      </Tooltip>
    </>
  );
}

export default EditPost;
