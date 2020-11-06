import React, { useEffect } from "react";
import { Route, useLocation } from "react-router-dom";
import useViewer from "@advisable-main/hooks/useViewer";

function RedirectToLogin({ viewer }) {
  const location = useLocation();

  useEffect(() => {
    const path = encodeURIComponent(`/guild${location.pathname}`);
    window.location.href = viewer ? `/applications` : `/login?redirect=${path}`;
  }, [location]);

  return null;
}

const AuthenticatedRoute = ({ render, component: Component, ...rest }) => {
  const viewer = useViewer();
  const guildUser = viewer?.isSpecialist && viewer?.guild;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!guildUser) {
          return <RedirectToLogin viewer={viewer} />;
        }

        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default AuthenticatedRoute;
