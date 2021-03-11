import React from "react";
import { get } from "lodash-es";
import { motion } from "framer-motion";
import { useDialogState, DialogDisclosure } from "reakit/Dialog";
import { Button, Tooltip, Box, Avatar, Text } from "@advisable/donut";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sticky from "../../components/Sticky";
import Layout from "../../components/Layout";
import Heading from "../../components/Heading";
import currency from "../../utilities/currency";
import VideoButton from "../../components/VideoButton";
import AttributeList from "../../components/AttributeList";
import { useMobile } from "../../components/Breakpoint";
import TalkModal from "../../components/TalkModal";
import ProjectTypeModal from "./ProjectTypeModal";
import StopWorkingModal from "./StopWorkingModal";
import useViewer from "src/hooks/useViewer";
import ReportFreelancerProblem from "./ReportFreelancerProblem";
import { HelpCircle, MessageCircle, Edit } from "@styled-icons/feather";

const Sidebar = ({ data, history, tutorialModal }) => {
  const viewer = useViewer();
  const isMobile = useMobile();
  const dialog = useDialogState();
  const { t } = useTranslation();
  const application = data.application;
  const { specialist, project } = application;
  const projectTypeModal = useDialogState();
  const isOwnerOrManager = project.isOwner || viewer.isTeamManager;
  const canStopWorking = application.status === "Working" && isOwnerOrManager;

  const handleEditPayment = () => {
    history.push("/settings/payments");
  };

  return (
    <Layout.Sidebar size="m">
      <Sticky offset={98} enabled={!isMobile}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box paddingBottom="l">
            <Avatar
              size="l"
              name={specialist.name}
              url={get(specialist, "image.url")}
            />
          </Box>
          <Heading level={3}>{specialist.name}</Heading>
          <Text fontSize="xs">
            {specialist.city}
            {specialist.country && `, ${specialist.country.name}`}
          </Text>
          <TalkModal
            dialog={dialog}
            conversationId={application.id}
            participants={[application.specialist]}
          />

          <Box paddingTop="xl">
            <DialogDisclosure
              as={Button}
              mb="xs"
              width="100%"
              align="left"
              variant="subtle"
              prefix={<MessageCircle />}
              {...dialog}
            >
              Message {specialist.firstName}
            </DialogDisclosure>
            <Box marginBottom={2}>
              <ReportFreelancerProblem application={application} />
            </Box>
            {canStopWorking && (
              <>
                <StopWorkingModal application={application} />
              </>
            )}
          </Box>
          <Box paddingY="xl">
            <ProjectTypeModal
              modal={projectTypeModal}
              application={application}
            />

            <AttributeList>
              {application.invoiceRate && (
                <AttributeList.Item
                  label="Hourly Rate"
                  value={currency(application.invoiceRate)}
                />
              )}

              {application.projectType === "Flexible" && isOwnerOrManager && (
                <AttributeList.Item
                  label="Monthly Limit"
                  action={
                    <DialogDisclosure {...projectTypeModal}>
                      {(disclosure) => (
                        <Button size="s" variant="subtle" {...disclosure}>
                          <Edit />
                        </Button>
                      )}
                    </DialogDisclosure>
                  }
                >
                  {application.monthlyLimit} hours
                </AttributeList.Item>
              )}

              {isOwnerOrManager ? (
                <AttributeList.Item
                  label="Project Type"
                  action={
                    <DialogDisclosure {...projectTypeModal}>
                      {(disclosure) => (
                        <Button
                          size="s"
                          aria-label="Edit project type"
                          variant="subtle"
                          {...disclosure}
                        >
                          <Edit />
                        </Button>
                      )}
                    </DialogDisclosure>
                  }
                >
                  <Tooltip
                    content={t(
                      `projectTypes.${application.projectType}.clientDescription`,
                    )}
                  >
                    <Box display="flex" alignItems="center">
                      <Box color="neutral500" mr="xxs">
                        <HelpCircle size={16} strokeWidth={2} />
                      </Box>
                      <div data-testid="projectType">
                        {t(`projectTypes.${application.projectType}.label`)}
                      </div>
                    </Box>
                  </Tooltip>
                </AttributeList.Item>
              ) : null}

              {isOwnerOrManager ? (
                <AttributeList.Item
                  label="Payment Method"
                  action={
                    <Button
                      variant="subtle"
                      onClick={handleEditPayment}
                      size="s"
                    >
                      <Edit />
                    </Button>
                  }
                >
                  {get(data, "viewer.projectPaymentMethod")}
                </AttributeList.Item>
              ) : null}
            </AttributeList>
          </Box>
          <Box paddingBottom="xl">
            {application.projectType === "Flexible" && (
              <DialogDisclosure as={VideoButton} {...tutorialModal}>
                {t(`tutorials.flexible_projects.prompt`)}
              </DialogDisclosure>
            )}
          </Box>
        </motion.div>
      </Sticky>
    </Layout.Sidebar>
  );
};

export default withRouter(Sidebar);
