import React from "react";
import { Redirect } from "react-router";
import { Query, Mutation } from "react-apollo";
import Back from "src/components/Back";
import Card from "src/components/Card";
import Text from "src/components/Text";
import NotFound from "src/views/NotFound";
import Loading from "src/components/Loading";
import Heading from "src/components/Heading";
import OfferForm from "src/components/OfferForm";
import FormattedText from "src/components/FormattedText";
import { currencySymbol } from "src/utilities/currency";
import { withNotifications } from "src/components/Notifications";

import { ProposalComment } from "./styles";
import FETCH_BOOKING from "./fetchBooking.graphql";
import CREATE_OFFER from "src/graphql/createOffer.graphql";

// Renders the view for a client viewing a specialists proposal.
const ViewProposal = ({ match, history, notifications }) => {
  const backURL = `/projects/${match.params.projectID}/proposed`;

  const goBack = () => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(backURL);
    }
  };

  return (
    <Query query={FETCH_BOOKING} variables={{ id: match.params.bookingID }}>
      {query => {
        if (query.loading) return <Loading />;
        if (query.error) return "Something went wrong";
        if (!query.data.booking) return <NotFound />;

        const { booking } = query.data;
        const { application } = booking;
        const { project, specialist } = application;
        console.log(application)

        if (booking.status !== "Proposed") return <NotFound />;

        return (
          <React.Fragment>
            <Back onClick={goBack}>Candidates</Back>
            <Card marginTop="xl" padding="xl">
              <Heading size="l">Proposal from {specialist.name}</Heading>
              <Text marginBottom='l'>Review the details of this proposal below</Text>
              {booking.proposalComment && (
                <ProposalComment>
                  <h4>Comment from {specialist.name}</h4>
                  <FormattedText>{booking.proposalComment}</FormattedText>
                </ProposalComment>
              )}
              <Mutation mutation={CREATE_OFFER}>
                {createOffer => (
                      <OfferForm
                        currency={currencySymbol(project.currency)}
                        initialValues={{
                          type: booking.type,
                          rate: booking.rate,
                          rateType: booking.rateType,
                          duration: booking.duration,
                          deliverables: booking.deliverables,
                          startDate: booking.startDate,
                          endDate: booking.endDate
                        }}
                        onSubmit={async values => {
                          const input = {
                            ...values,
                            applicationId: application.id,
                            proposalId: booking.id
                          };

                          await createOffer({
                            variables: { input }
                          });

                          notifications.notify(
                            `An offer has been sent to ${specialist.name}`
                          );

                          history.replace(backURL)
                        }}
                      />
                )}
              </Mutation>
            </Card>
          </React.Fragment>
        );
      }}
    </Query>
  );
};

export default withNotifications(ViewProposal);
