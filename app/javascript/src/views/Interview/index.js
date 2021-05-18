import React from "react";
import { Switch, useParams } from "react-router-dom";
import AccessDenied, { isNotAuthorized } from "src/views/AccessDenied";
import NotFound, { isNotFound } from "src/views/NotFound";
import Route from "src/components/Route";
import Loading from "src/components/Loading";
import { useInterview } from "./queries";
import CallScheduled from "./CallScheduled";
import CallRequested from "./CallRequested";
import NeedMoreTimeOptions from "./NeedMoreTimeOptions";
import MoreTimeOptionsAdded from "./MoreTimeOptionsAdded";
import ClientRequestedReschedule from "./ClientRequestedReschedule";
import SpecialistRequestedReschedule from "./SpecialistRequestedReschedule";
import RescheduleInterview from "./RescheduleInterview";

function InterviewState({ interview }) {
  switch (interview.status) {
    case "Call Requested": {
      return <CallRequested interview={interview} />;
    }

    case "Call Scheduled": {
      return <CallScheduled interview={interview} />;
    }

    case "Call Complete": {
      return <>This interview has been complete.</>;
    }

    case "Client Requested Reschedule": {
      return <ClientRequestedReschedule interview={interview} />;
    }

    case "Specialist Requested Reschedule": {
      return <SpecialistRequestedReschedule interview={interview} />;
    }

    case "Need More Time Options": {
      return <NeedMoreTimeOptions interview={interview} />;
    }

    case "More Time Options Added": {
      return <MoreTimeOptionsAdded interview={interview} />;
    }

    default: {
      return null;
    }
  }
}

export default function Interview() {
  const { id } = useParams();
  const { data, loading, error } = useInterview({ variables: { id } });

  if (loading) return <Loading />;
  if (isNotFound(error)) return <NotFound />;
  if (isNotAuthorized(error)) return <AccessDenied />;

  const interview = data.interview;

  return (
    <Switch>
      <Route path="/interviews/:id/reschedule">
        <RescheduleInterview interview={interview} />
      </Route>
      <Route>
        <InterviewState interview={interview} />
      </Route>
    </Switch>
  );
}
