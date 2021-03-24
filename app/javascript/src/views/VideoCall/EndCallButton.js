import React from "react";
import { LogOut } from "@styled-icons/ionicons-outline/LogOut";
import ActionBar from "components/ActionBar";
import useCallContext from "./useCallContext";

export default function EndCallButton({ disabled }) {
  const { leave } = useCallContext();

  return (
    <ActionBar.Item
      onClick={leave}
      disabled={disabled}
      data-testid="leaveCall"
      icon={<LogOut />}
      label="Leave"
    />
  );
}
