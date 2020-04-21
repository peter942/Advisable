import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { Formik } from "formik";
import Modal from "src/components/Modal";
import Text from "src/components/Text";
import Heading from "src/components/Heading";
import Select from "src/components/Select";
import { RoundedButton, Columns } from "@advisable/donut";
import TextField from "src/components/TextField";
import { withNotifications } from "src/components/Notifications";
import validationSchema from "./validationSchema";

import { Container } from "./styles";
import REJECT from "./reject.graphql";

// Takes a given application record and returns an array of rejection reasons. This is
// needed becuase we only show the "I just want to see more candidates" reason when
// the application status is Applied.
const optionsForApplication = (application) => {
  const options = [
    "I want someone with more relevant experience",
    "I want someone cheaper",
    "I didn't like their answers",
    "They just don't seem like a good fit",
  ];

  if (application.status === "Applied") {
    options.push("I just want to see more candidates");
  }

  return options;
};

// Defines the placeholder holder values for the optionsn that require a rejectionReasonComment
const PLACEHOLDERS = {
  "I want someone with more relevant experience":
    "In what way would their experience be different?",
  "I want someone cheaper": "Please describe what price range you had in mind",
  "I didn't like their answers":
    "Please describe information you felt was missing in these answers.",
  "They just don't seem like a good fit":
    "Please describe what a better candidate would look like.",
};

// Renders the correct content for the selected option. This is required because for the
// "I just want to see more" option we render a different CTA.
const SelectedOption = ({ formik, onClose, onRequestCall }) => {
  switch (formik.values.rejectionReason) {
    case undefined: {
      return null;
    }

    case "I just want to see more candidates": {
      return (
        <React.Fragment>
          <Text size="s" marginBottom="l" marginTop="m">
            We encourage you to talk to relevant candidates as they come in.
            This ensures that they’re still available and lets us calibrate the
            search ASAP.
          </Text>
          <RoundedButton onClick={onRequestCall} size="l" type="button">
            Request Call
          </RoundedButton>
        </React.Fragment>
      );
    }

    default: {
      return (
        <React.Fragment>
          <TextField
            block
            multiline
            autoFocus
            name="rejectionReasonComment"
            marginTop="m"
            marginBottom="m"
            onBlur={formik.handleBlur}
            error={
              formik.submitCount > 0 && formik.errors.rejectionReasonComment
            }
            value={formik.values.rejectionReasonComment}
            onChange={formik.handleChange}
            placeholder={PLACEHOLDERS[formik.values.rejectionReason]}
          />
          <Columns spacing="xs">
            <RoundedButton
              size="l"
              type="submit"
              width="100%"
              variant="dark"
              loading={formik.isSubmitting}
            >
              Reject
            </RoundedButton>
            <RoundedButton
              size="l"
              type="button"
              width="100%"
              onClick={onClose}
              variant="subtle"
            >
              Cancel
            </RoundedButton>
          </Columns>
        </React.Fragment>
      );
    }
  }
};

const RejectModal = ({
  application,
  isOpen,
  onClose,
  notifications,
  onRequestCall,
}) => {
  const specialist = application.specialist;
  const [reject] = useMutation(REJECT);

  const initialValues = {
    rejectionReason: "",
    rejectionReasonComment: "",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await reject({
            variables: {
              input: {
                id: application.airtableId,
                ...values,
              },
            },
          });

          notifications.notify(`${specialist.name} has been declined`);

          onClose();
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <Container>
              <Heading marginBottom="xs">Reject {specialist.name}</Heading>
              <Text marginBottom="xl">
                Please provide feedback to our recruitment team to help us find
                you a better candidate
              </Text>
              <Select
                block
                name="rejectionReason"
                value={formik.values.rejectionReason}
                onChange={formik.handleChange}
                placeholder="Select reason for rejection"
                options={optionsForApplication(application)}
              />
              <SelectedOption
                formik={formik}
                onClose={onClose}
                onRequestCall={onRequestCall}
              />
            </Container>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default withNotifications(RejectModal);
