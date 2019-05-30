import React from "react";
import { get } from "lodash";
import { Mutation } from "react-apollo";
import { useTranslation } from "react-i18next";
import Sticky from "react-stickynode";
import Button from "../../components/Button";
import Text from "../../components/Text";
import Modal from "../../components/Modal";
import Avatar from "../../components/Avatar";
import Layout from "../../components/Layout";
import Heading from "../../components/Heading";
import currency from "../../utilities/currency";
import { Padding } from "../../components/Spacing";
import { FadeIn } from "../../components/Animation";
import VideoButton from "../../components/VideoButton";
import AttributeList from "../../components/AttributeList";
import { useMobile } from "../../components/Breakpoint";
import ProjectTypeModal from "../../components/ProjectTypeModal";
import ProjectMonthlyLimit from "../../components/ProjectMonthlyLimit";
import SET_PROJECT_TYPE from "./setProjectType";

export default ({ data, tutorial }) => {
  const isMobile = useMobile();
  const { t } = useTranslation();
  const application = data.application;
  const specialist = application.specialist;
  const [projectTypeModal, setProjectTypeModal] = React.useState(false);
  const [monthlyLimitModal, setMonthlyLimitModal] = React.useState(false);

  const handleEditMonthlyLimit = () => {
    setMonthlyLimitModal(true);
  };

  return (
    <Layout.Sidebar size="m">
      <Sticky top={98} enabled={!isMobile}>
        <FadeIn duration="500ms">
          <Padding bottom="l">
            <Avatar
              size="l"
              name={specialist.name}
              url={get(specialist, "image.url")}
            />
          </Padding>
          <Heading level={3}>{specialist.name}</Heading>
          <Text size="xs">
            {specialist.city}
            {specialist.country && `, ${specialist.country.name}`}
          </Text>
          <Padding top="xl" bottom="xl">
            <AttributeList>
              {Boolean(application.rate) && (
                <AttributeList.Item
                  label="Hourly Rate"
                  value={currency(parseFloat(application.rate) * 100.0)}
                />
              )}

              {application.projectType === "Flexible" && (
                <>
                  <Modal
                    isOpen={monthlyLimitModal}
                    onClose={() => setMonthlyLimitModal(false)}
                  >
                    <Padding size="xl">
                      <ProjectMonthlyLimit
                        applicationId={application.airtableId}
                        onUpdate={() => setMonthlyLimitModal(false)}
                        initialValues={{
                          monthlyLimit: application.monthlyLimit,
                        }}
                      />
                    </Padding>
                  </Modal>
                  <AttributeList.Item
                    label="Monthly Limit"
                    value={
                      <>
                        {application.monthlyLimit} hours
                        <br />
                        <Button
                          onClick={handleEditMonthlyLimit}
                          styling="plainSubtle"
                        >
                          Edit
                        </Button>
                      </>
                    }
                  />
                </>
              )}

              <Mutation mutation={SET_PROJECT_TYPE}>
                {setProjectType => (
                  <ProjectTypeModal
                    isOpen={projectTypeModal}
                    onClose={() => setProjectTypeModal(false)}
                    firstName={application.specialist.firstName}
                    initialValues={{ projectType: application.projectType }}
                    onSubmit={async values => {
                      const { data } = await setProjectType({
                        variables: {
                          input: {
                            application: application.airtableId,
                            projectType: values.projectType,
                          },
                        },
                      });

                      const a = data.setTypeForProject.application;
                      // If there is no monthly limit then the page is going
                      // to re-rendering asking the user to set a monthly limit
                      // this check prevents the modal state being changed after
                      // it has unmounted.
                      if (!a.monthlyLimit && a.projectType === "Flexible") {
                        return;
                      } else {
                        setProjectTypeModal(false);
                      }
                    }}
                  />
                )}
              </Mutation>

              <AttributeList.Item
                label="Project Type"
                value={
                  <>
                    {application.projectType}
                    <br />
                    <Button
                      styling="plainSubtle"
                      aria-label="Edit project type"
                      onClick={() => setProjectTypeModal(true)}
                    >
                      Edit
                    </Button>
                  </>
                }
              />
            </AttributeList>
          </Padding>
          <Padding bottom="xl">
            <VideoButton onClick={tutorial.start}>
              {t(`tutorials.${tutorial.name}.prompt`)}
            </VideoButton>
          </Padding>
        </FadeIn>
      </Sticky>
    </Layout.Sidebar>
  );
};
