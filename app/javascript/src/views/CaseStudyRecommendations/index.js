import React from "react";
import { Switch, Route, Redirect } from "react-router";
import RecommendationsInbox from "./Inbox";

export default function CaseStudyRecommendations() {
  return (
    <Switch>
      <Route path="/explore" exact>
        searches
      </Route>
      <Route path="/explore/:id" component={RecommendationsInbox} />
      <Redirect to="/explore" />
    </Switch>
  );
}
