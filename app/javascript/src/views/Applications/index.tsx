// Renders the freelancers applications view.
import * as React from "react";
import { graphql } from "react-apollo";
import Layout from "../../components/Layout";
import ApplicationInvitations from "./ApplicationInvitations";
import OpenApplications from "./OpenApplications";
import FETCH_DATA from "./fetchData.graphql";

const Applications = ({ history, data, ...props }) => {
  console.log(data)
  const handleViewInvitation = id => {
    history.push(`/invites/${id}`);
  };

  return (
    <Layout>
      <Layout.Main>
        <ApplicationInvitations
          loading={data.loading}
          onViewInvitation={handleViewInvitation}
          applications={data.loading ? [] : data.viewer.invitations}
        />
        <OpenApplications
          loading={data.loading}
          specialist={data.viewer}
          applications={data.loading ? [] : data.viewer.applications}
          featuredURL={
            data.loading
              ? null
              : encodeURI(
                  `https://advisable.com/request_feature_invitation?field75221875=${
                    data.viewer.email
                  }&sid=${data.viewer.airtableId}`
                )
          }
        />
      </Layout.Main>
    </Layout>
  );
};

export default graphql<any, any, any, any>(FETCH_DATA)(Applications);
