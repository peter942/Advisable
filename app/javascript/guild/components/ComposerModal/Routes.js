import React from "react";
import { Switch, Redirect, useLocation } from "react-router-dom";
import Route from "src/components/Route";
import CreateGuildPost from "./CreateGuildPost";
import CreatePostFromPrompt from "./CreatePostFromPrompt";
import EditGuildPost from "./EditGuildPost";
import EditImages from "./EditImages";
import EditAudience from "./EditAudience";
import EditTargeting from "./EditTargeting";
import Review from "./Review";

function RedirectToStep({ step }) {
  const location = useLocation();
  return <Redirect to={`${location.pathname}/${step}`} />;
}

function Routes({ onPublish, selectDataQuery, guildPost, postPrompt }) {
  return (
    <Switch>
      <Route path="*composer" exact>
        <RedirectToStep step="new" />
      </Route>

      <Route path="*composer/new" exact>
        <CreateGuildPost />
      </Route>

      <Route path="*composer/prompt/:id" exact>
        <CreatePostFromPrompt postPrompt={postPrompt} />
      </Route>

      <Route path="*composer/:id" exact>
        <RedirectToStep step="post" />
      </Route>

      <Route path="*composer/:id/type" exact>
        {guildPost?.postPrompt ? (
          <EditGuildPost guildPost={guildPost} />
        ) : (
          <CreateGuildPost guildPost={guildPost} />
        )}
      </Route>

      <Route path="*composer/:id/post">
        <EditGuildPost guildPost={guildPost} />
      </Route>

      <Route path="*composer/:id/images">
        <EditImages guildPost={guildPost} />
      </Route>

      <Route path="*composer/:id/audience">
        <EditAudience guildPost={guildPost} />
      </Route>

      <Route path="*composer/:id/targeting">
        {guildPost?.audienceType === "none" ? (
          <Redirect to={`/composer/${guildPost.id}/review`} />
        ) : (
          <EditTargeting
            guildPost={guildPost}
            selectDataQuery={selectDataQuery}
          />
        )}
      </Route>

      <Route path="*composer/:id/review">
        <Review guildPost={guildPost} onPublish={onPublish} />
      </Route>
    </Switch>
  );
}

export default Routes;
