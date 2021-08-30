import React from "react";
import Talk from "talkjs";
import { use100vh } from "react-div-100vh";
import queryString from "query-string";
import { useBreakpoint } from "@advisable/donut";
import useViewer from "../../hooks/useViewer";
import { Container, Main } from "./styles";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import createTalkSession from "../../utilities/createTalkSession";
import { useLocation } from "react-router-dom";

const Messages = () => {
  const height = use100vh();
  const location = useLocation();
  const isMobile = useBreakpoint("m");
  const container = React.useRef(null);
  const [applicationId, setAppliationId] = React.useState(null);
  const queryParams = queryString.parse(location.search);
  const viewer = useViewer();

  React.useEffect(() => {
    Talk.ready.then(() => {
      const session = createTalkSession(viewer);

      const inbox = session.createInbox({
        showChatHeader: false,
        showFeedHeader: false,
      });

      inbox.mount(container.current);

      inbox.on("conversationSelected", (e) => {
        if (e.conversation) {
          setAppliationId(e.conversation.id);
        } else {
          setAppliationId(null);
        }
      });

      if (queryParams.conversation) {
        inbox.select(queryParams.conversation);
      }
    });
  }, []);

  return (
    <>
      {Boolean(applicationId) && isMobile && (
        <TopBar applicationId={applicationId} />
      )}
      <Container>
        <Main>
          <div
            style={{
              height: isMobile ? height - 180 : height - 60,
            }}
          >
            <div
              ref={container}
              style={{
                height: "100%",
              }}
            />
          </div>
        </Main>
        {Boolean(applicationId) && <Sidebar applicationId={applicationId} />}
      </Container>
    </>
  );
};

export default Messages;
