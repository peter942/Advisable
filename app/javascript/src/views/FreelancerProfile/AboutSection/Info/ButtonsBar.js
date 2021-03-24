import React from "react";
import RequestTalkButton from "./RequestTalkButton";
import IconLink from "./IconLink";
import { Linkedin } from "@styled-icons/fa-brands/Linkedin";
import { Globe } from "@styled-icons/feather/Globe";
import EditInfo from "./EditInfo";
import { Box } from "@advisable/donut";
import MessageButton from "./MessageButton";
import useViewer from "../../../../hooks/useViewer";

function ButtonsBar({ isOwner, specialist }) {
  const viewer = useViewer();
  const viewerIsGuild = viewer?.guild || false;

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      ml="auto"
      mt={{ _: "l", s: "l", m: 0 }}
      mr={{ l: "m", s: "s" }}
    >
      {specialist.linkedin && (
        <IconLink title="LinkedIn" url={specialist.linkedin} Icon={Linkedin} />
      )}
      {specialist.website && (
        <IconLink
          title="Website"
          url={specialist.website}
          Icon={Globe}
          strokeWidth={2}
        />
      )}
      {isOwner && <EditInfo specialist={specialist}>Edit Info</EditInfo>}
      {!isOwner && !viewerIsGuild && (
        <RequestTalkButton id={specialist.id}>Request a talk</RequestTalkButton>
      )}
      {!isOwner && viewerIsGuild ? (
        <MessageButton specialist={specialist} />
      ) : null}
    </Box>
  );
}

export default ButtonsBar;
