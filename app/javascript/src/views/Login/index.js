// Renders the login page
import React from "react";
import { Switch, Route } from "react-router-dom";
import useScrollRestore from "../../utilities/useScrollRestore";
import { Box } from "@advisable/donut";
import Signup from "./Signup";
import Orbits from "./Orbits";
import LoginView from "./LoginView";

const Login = () => {
  useScrollRestore();

  return (
    <>
      <Orbits />
      <Box position="relative">
        <Switch>
          <Route path="/login/signup">
            <Signup />
          </Route>
          <Route>
            <LoginView />
          </Route>
        </Switch>
      </Box>
    </>
  );
};

export default Login;
