import { Redirect, Switch, useLocation } from "react-router-dom";
import React, { Suspense, lazy } from "react";

import Route from "src/components/Route";
import Loading from "src/components/Loading";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Login from "./views/Login";
import Signup from "./views/Signup";
import RootPath from "./views/RootPath";
import ApplicationRoutes from "./ApplicationRoutes";

const ResetPassword = lazy(() => import("./views/ResetPassword"));
const ConfirmAccount = lazy(() => import("./views/ConfirmAccount"));
const VerifyProject = lazy(() => import("./views/VerifyProject"));
const Availability = lazy(() => import("./views/Availability"));
const ClientJoin = lazy(() => import("./views/ClientJoin"));
const FreelancerJoin = lazy(() => import("./views/FreelancerJoin"));
const VideoCall = lazy(() => import("./views/VideoCall"));

const Routes = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <AuthenticatedRoute exact path="/" component={RootPath} />
        <Route path="/login" component={Login} />
        <Route
          path="/reset_password"
          render={(props) => <ResetPassword {...props} />}
        />
        <Route
          path="/confirm_account/:token"
          render={(props) => <ConfirmAccount {...props} />}
        />
        <Route path="/signup/:id" component={Signup} />
        <AuthenticatedRoute
          exact
          clientOnly
          path="/clients/:userID/availability"
          component={Availability}
        />
        <AuthenticatedRoute path="/calls/:id" component={VideoCall} />
        <Redirect
          from="/freelancers/signup"
          to={{ pathname: "/freelancers/join", search: location.search }}
        />
        <Route path="/clients/join" component={ClientJoin} />
        <Route path="/freelancers/join" component={FreelancerJoin} />
        <Route path="/verify_project/:id" component={VerifyProject} />
        <Route component={ApplicationRoutes} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
