import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import Route from "src/components/Route";
import ResetPassword from "./ResetPassword";
import RequestPasswordReset from "./RequestPasswordReset";

function ResetPasswordContainer() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={match.path} exact>
        <RequestPasswordReset />
      </Route>
      <Route path={`${match.path}/:token`}>
        <ResetPassword />
      </Route>
    </Switch>
  );
}

export default ResetPasswordContainer;
