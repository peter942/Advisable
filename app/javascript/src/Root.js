import { Route, Switch } from "react-router-dom";
import { hot, setConfig } from "react-hot-loader";
import React, { Suspense, lazy } from "react";

import Loading from "src/components/Loading";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Project from "./views/Project";
import Login from "./views/Login";
import Setup from "./views/Setup";
import Signup from "./views/Signup";
import RootPath from "./views/RootPath";
import Projects from "./views/Projects";
import ViewOffer from "./views/ViewOffer";
import References from "./views/References";
import ProjectSetup from "./views/ProjectSetup";
import Availability from "./views/Availability";
import EditProposal from "./views/EditProposal";
import NotFoundError from "./views/NotFound/error";
import CreateProposal from "./views/CreateProposal";
import InterviewRequest from "./views/InterviewRequest";
import NotFoundBoundary from "./views/NotFound/NotFoundBoundary";

const ResetPassword = lazy(() => import("./views/ResetPassword"));
const ConfirmAccount = lazy(() => import("./views/ConfirmAccount"));

setConfig({ pureSFC: true });

const Root = ({ location, history }) => {

  return (
    <NotFoundBoundary>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/reset_password" component={ResetPassword} />
          <Route path="/confirm_account/:token" component={ConfirmAccount} />
          <AuthenticatedRoute exact path="/" component={RootPath} />
          <AuthenticatedRoute path="/setup" component={Setup} />
          <Route path="/project_setup/:projectID?" component={ProjectSetup} />
          <Route path="/projects/:projectID" component={Project} />
          <AuthenticatedRoute path="/projects" component={Projects} />
          <Route path="/offers/:bookingID" component={ViewOffer} />
          <Route
            path="/clients/:userID/availability"
            component={Availability}
          />
          <Route
            path="/specialists/:specialistID/references"
            component={References}
          />
          <Route
            path="/interview_request/:interviewID"
            component={InterviewRequest}
          />
          <Route
            path="/applications/:applicationID/proposal"
            component={CreateProposal}
          />
          <Route
            path="/applications/:applicationID/proposals/:proposalID"
            component={EditProposal}
          />
          <Route
            render={() => {
              throw new NotFoundError();
            }}
          />
        </Switch>
      </Suspense>
    </NotFoundBoundary>
  );
};

export default hot(module)(Root);
