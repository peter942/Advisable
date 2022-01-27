import { makeVar, useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { RefreshCw } from "@styled-icons/feather/RefreshCw";
import { Link, Circle, Box, Text, Button } from "@advisable/donut";
import { PageError } from "src/components/ErrorBoundary";

export const csrfError = makeVar(false);

const CHUNK_LOAD_EXPIRY = 60000; // 1 min

function markChunkLoadErrorTime() {
  localStorage.setItem(
    "chunkLoadError",
    new Date().getTime() + CHUNK_LOAD_EXPIRY,
  );
}

function handleChunkLoadWithrefresh() {
  const timestamp = window.localStorage.getItem("chunkLoadError");
  if (!timestamp) return true;
  const isExpired = new Date().getTime() > timestamp;
  return isExpired;
}

function PromptToRefresh() {
  return (
    <PageError>
      <Text marginBottom={3}>
        An unexpected error has occurred. Please refresh the page and try again.
      </Text>
      <Text>
        If the error persists please{" "}
        <Link mailto="hello@advisable.com">contact us</Link>.
      </Text>
    </PageError>
  );
}

// When a user visits a url on the app, their browser downloads the assets for
// the page they are viewing. When they then click a link to go to another
// page their browser will request the assets for those pages. These assets
// are fingerprinted based on the contents of the file. In the even that a
// deployment is made while a user is on the site, by the time that they try
// to navigate to a new flow, the new deployment may have changed the names
// of these assets which results in a failed to load chunk error.
// To handle these errors we attempt to refresh the page for the user and to
// update them to the new version of the app. We store a timestamp when we
// attempt to refresh the page to prevent any chance of putting the user into
// a refresh loop in the event that the error is due to something else. As a
// fallback we display a message saying a new update has been released
// and ask the user to upgrade by refreshing their browser, this will request
// the most recent assets.
function UpdateAvailable() {
  const shouldHandleRedirect = handleChunkLoadWithrefresh();

  // Catch chunk load errors
  useEffect(() => {
    if (shouldHandleRedirect) {
      markChunkLoadErrorTime();
      window.location.reload();
    }
  }, [shouldHandleRedirect]);

  if (shouldHandleRedirect) return null;

  return (
    <Box maxWidth={340} mx="auto" my="xxl" textAlign="center">
      <Circle bg="blue800" mb="m" color="white">
        <RefreshCw size={24} strokeWidth={2} />
      </Circle>
      <Text
        mb="xs"
        as="h1"
        fontSize="xxl"
        color="blue900"
        fontWeight="semibold"
        letterSpacing="-0.05em"
      >
        Update Available
      </Text>
      <Text fontSize="s" lineHeight="s" color="neutral900" mb="l">
        A new version of Advisable has been released since you last reloaded the
        page. You will need to reload the page to upgrade to the new version.
      </Text>
      <Button size="l" onClick={() => location.reload()}>
        Upgrade to new version
      </Button>
    </Box>
  );
}

function RootErrorBoundaryFallback({ error, ...props }) {
  const updateAvailable = error.name && error.name.match(/ChunkLoadError/);
  if (updateAvailable) return <UpdateAvailable />;

  return <PageError {...props} />;
}

export default function RootErrorBoundary({ children }) {
  const csrfErrorOccured = useReactiveVar(csrfError);

  if (csrfErrorOccured) {
    return <PromptToRefresh />;
  }

  return (
    <Sentry.ErrorBoundary fallback={RootErrorBoundaryFallback}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
