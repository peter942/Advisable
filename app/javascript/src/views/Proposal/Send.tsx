import * as React from "react";
import { Formik, Form } from "formik";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ButtonGroup from "../../components/ButtonGroup";
import Heading from "../../components/Heading";
import TextField from "../../components/TextField";
import { Padding } from "../../components/Spacing";
import SEND_PROPOSAL from "./sendProposal.graphql";
import { useMobile } from "../../components/Breakpoint";
import { hasCompleteTasksStep } from "./validationSchema";

const Send = ({ application, history }) => {
  const isMobile = useMobile();
  const [sendProposal] = useMutation(SEND_PROPOSAL);

  // If they haven't complete the tasks step then redirect back
  if (!hasCompleteTasksStep(application)) {
    return <Redirect to="tasks" />;
  }

  const handleSubmit = async (values) => {
    await sendProposal({
      variables: {
        input: {
          application: application.airtableId,
          ...values,
        },
      },
    });

    history.push("sent");
  };

  return (
    <Card>
      <Padding size="l">
        <Padding bottom="l">
          <Heading level={3}>Send Proposal</Heading>
        </Padding>
        <Formik
          onSubmit={handleSubmit}
          initialValues={{ proposalComment: application.proposalComment || "" }}
        >
          {(formik) => (
            <Form>
              <Padding bottom="l">
                <TextField
                  multiline
                  autoHeight
                  name="proposalComment"
                  onBlur={formik.handleBlur}
                  value={formik.values.proposalComment}
                  onChange={formik.handleChange}
                  label="Include a short message"
                  placeholder="Add a message..."
                />
              </Padding>
              <ButtonGroup fullWidth={isMobile}>
                <Button
                  loading={formik.isSubmitting}
                  type="submit"
                  styling="primary"
                >
                  Send Proposal
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </Padding>
    </Card>
  );
};

export default Send;
