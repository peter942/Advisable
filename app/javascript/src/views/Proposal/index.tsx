import * as React from "react";
import { compose, graphql } from "react-apollo";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "../../components/Layout";
import Rate from "./Rate";
import Send from "./Send";
import Sent from "./Sent";
import Tasks from "./Tasks";
import Sidebar from "./Sidebar";
import Loading from "./Loading";
import FETCH_APPLICATION from "./fetchApplication.graphql";

const Proposals = ({ fetchApplication }) => {
  if (fetchApplication.loading) {
    return <Loading />;
  }

  const application = fetchApplication.application;
  const urlPrefix = `/applications/${application.airtableId}/proposal`;

  return (
    <Layout>
      <Sidebar application={application} />
      <Layout.Main>
        <Switch>
          <Route
            exact
            path={urlPrefix}
            render={props => <Rate application={application} {...props} />}
          />
          <Route
            path={`${urlPrefix}/tasks`}
            render={props => <Tasks application={application} {...props} />}
          />
          <Route
            path={`${urlPrefix}/send`}
            render={props => <Send application={application} {...props} />}
          />
          <Route
            path={`${urlPrefix}/sent`}
            render={props => <Sent application={application} {...props} />}
          />
          <Route render={() => <Redirect to={urlPrefix} />} />
        </Switch>
      </Layout.Main>
    </Layout>
  );
};

export default compose(
  graphql(FETCH_APPLICATION, {
    name: "fetchApplication",
    options: (props: any) => ({
      variables: {
        id: props.match.params.applicationId,
      },
    }),
  })
)(Proposals);
