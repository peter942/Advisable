// Renders the sidebar in the freelancer active application view.
import React from "react";
import Sticky from "../../components/Sticky";
import { useTranslation } from "react-i18next";
import Back from "../../components/Back";
import Text from "../../components/Text";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Padding from "../../components/Spacing/Padding";
import VideoButton from "../../components/VideoButton";
import AttributeList from "../../components/AttributeList";
import TalkModal from "../../components/TalkModal";
import { useMobile } from "../../components/Breakpoint";
import currency from "../../utilities/currency";

const Component = ({ data, tutorial }) => {
  const isMobile = useMobile();
  const { t } = useTranslation();
  const application = data.application;
  const [talkModal, setTalkModal] = React.useState(false);

  return (
    <Layout.Sidebar>
      <Sticky offset={98} enabled={!isMobile}>
        <Padding bottom="xl">
          <Back to="/clients">All Clients</Back>
        </Padding>
        <Heading level={3}>{application.project.primarySkill}</Heading>
        <Text>{application.project.user.companyName}</Text>
        <TalkModal
          isOpen={talkModal}
          onClose={() => setTalkModal(false)}
          conversationId={application.id}
          participants={[application.project.user]}
        />
        <Padding top="xl">
          <Button
            block
            icon="message-circle"
            styling="primary"
            onClick={() => setTalkModal(true)}
          >
            Message {application.project.user.firstName}
          </Button>
        </Padding>
        <Padding top="l" bottom="xl">
          <AttributeList>
            {Boolean(application.rate) && (
              <AttributeList.Item
                label="Hourly Rate"
                value={currency(parseFloat(application.rate) * 100.0)}
              />
            )}
            {Boolean(application.projectType === "Flexible") && (
              <AttributeList.Item
                label="Monthly Limit"
                value={`${application.monthlyLimit} hours`}
              />
            )}
            <AttributeList.Item
              label="Project Type"
              value={application.projectType}
            />
          </AttributeList>
        </Padding>
        <Padding bottom="xl">
          <VideoButton onClick={tutorial.start}>
            {t(`tutorials.${tutorial.name}.prompt`)}
          </VideoButton>
        </Padding>
      </Sticky>
    </Layout.Sidebar>
  );
};

export default Component;
