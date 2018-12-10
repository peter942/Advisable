import React, { useState } from "react";
import { graphql } from "react-apollo";
import Text from "../Text";
import Modal from "../Modal";
import Button from "../Button";
import Heading from "../Heading";
import { useMobile } from "../Breakpoint";
import ButtonGroup from "../ButtonGroup";
import { withNotifications } from "../Notifications";
import REQUEST_REFERENCES from "./requestReferences.graphql";

const RequestReferences = ({
  isOpen,
  onClose,
  application,
  notifications,
  requestReferences
}) => {
  const isMobile = useMobile();
  const [isLoading, setLoading] = useState(false);
  const name = application.specialist.name;

  const handleSubmit = async () => {
    setLoading(true);
    await requestReferences({
      variables: {
        input: {
          id: application.airtableId
        }
      }
    });
    setLoading(false);
    notifications.notify(`References have been requested for ${name}`);
    onClose();
  };

  return (
    <Modal padding="xl" isOpen={isOpen} onClose={onClose}>
      <Heading marginBottom="m">Request References For {name}</Heading>
      <Text marginBottom="xl">
        Do you need validated references and reviews for {name}? We can reach
        out to their previous clients in order to get feedback on their past
        projects and performance and share the results with you.
      </Text>
      <ButtonGroup fullWidth={isMobile}>
        <Button loading={isLoading} onClick={handleSubmit} styling="primary">
          Request References
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </ButtonGroup>
    </Modal>
  );
};

export default graphql(REQUEST_REFERENCES, {
  name: "requestReferences"
})(withNotifications(RequestReferences));
