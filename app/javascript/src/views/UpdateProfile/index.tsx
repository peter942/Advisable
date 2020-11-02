import * as React from "react";
import Layout from "../../components/Layout";
import { useMobile } from "../../components/Breakpoint";
import { Switch, Route, Redirect } from "react-router-dom";
import Navigation from "./Navigation";
import Profile from "./Profile";
import Location from "./Location";
import Password from "./Password";
import References from "./References";
import PaymentSettings from "./PaymentSettings";

// The navigation for a freelancers profile works differently on mobile compared
// to desktop. On desktop the navigation is always present in the sidebar,
// where as on mobile the user first sees just the navigation menu and then
// clicks into one of the sub views.
const UpdateProfile = ({ match }) => {
  const isMobile = useMobile();

  return (
    <Layout>
      {/* On mobile we only want to show the navigation menu if the URL is
        exactly /applications. On desktop we want to display it on any routes
        that match/applications */}
      <Route path={match.path} component={Navigation} exact={isMobile} />
      <Layout.Main>
        <Switch>
          <Route path="/profile" exact component={Profile} />
          <Route path="/profile/location" component={Location} />
          <Route path="/profile/references" component={References} />
          <Route path="/profile/payments" component={PaymentSettings} />
          <Route path="/profile/password" component={Password} />
          {/* If we are on desktop then redirect user to /profile/introduction
            if their URL is exactly /profile */}
          {!isMobile && (
            <Route
              exact
              path={match.path}
              render={() => <Redirect to="/profile/introduction" />}
            />
          )}
        </Switch>
      </Layout.Main>
    </Layout>
  );
};

export default UpdateProfile;
