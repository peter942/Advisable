import React from "react";
import { Spring } from "react-spring";
import { withRouter } from "react-router-dom";
import Text from "src/components/Text";
import Avatar from "src/components/Avatar";
import Divider from "src/components/Divider";
import Spacing from "src/components/Spacing";
import Button from "src/components/Button";
import FeaturedBadge from "src/components/FeaturedBadge";
import Questions from "./Questions";
import RejectModal from "src/components/RejectModal";
import RejectProposalModal from "src/components/RejectProposalModal";
import Skills from "src/components/Skills";
import RequestReferences from "src/components/RequestReferences";
import CandidateAttributes from "src/components/CandidateAttributes";
import RequestIntroduction from "src/components/RequestIntroduction";
import currency from "src/utilities/currency";
import AdvisableComment from "../AdvisableComment";
import {
  Card,
  Name,
  Location,
  MoreInfo,
  CandidateHeader,
  NameAndLocation,
  CandidateHeaderActions
} from "./styles";

const REJECT_PROPOSAL_MODAL = "REJECT_PROPOSAL_MODAL";
const REQUEST_REFERENCES_MODAL = "REQUEST_REFERENCES_MODAL";

class Candidate extends React.Component {
  state = {
    expanded: false,
    modal: null
  };

  clickToExpand = e => {
    // Prevent expanding if the user clicked a link.
    if (e.target.tagName === "A") return;
    // Prevent expanding or collapsing if the user is selecting text.
    const selection = window.getSelection();
    if (this.state.expanded && selection.toString().length > 0) {
      return;
    }

    this.setState({ expanded: !this.state.expanded });
  };

  get moreInfoHeight() {
    return this.moreInfo ? this.moreInfo.scrollHeight : 0;
  }

  render() {
    const { application, project } = this.props;
    const { proposal } = application;

    return (
      <Card padding="xl" expanded={this.state.expanded}>
        <RequestIntroduction
          isOpen={this.state.modal === "introduction"}
          application={application}
          onClose={() => {
            this.setState({ modal: null });
          }}
        />
        <RejectModal
          isOpen={this.state.modal === "reject"}
          onRequestCall={() => this.setState({ modal: "introduction" })}
          application={application}
          onClose={() => {
            this.setState({ modal: null });
          }}
        />
        <RequestReferences
          application={application}
          isOpen={this.state.modal === REQUEST_REFERENCES_MODAL}
          onClose={() => this.setState({ modal: null })}
        />

        <CandidateHeader>
          <Avatar
            name={application.specialist.name}
            url={
              application.specialist.image
                ? application.specialist.image.url
                : null
            }
          />
          <NameAndLocation>
            <Name>{application.specialist.name}</Name>
            <Location>
              {application.specialist.city}
              {application.specialist.country &&
                `, ${application.specialist.country.name}`}
            </Location>
          </NameAndLocation>
          <CandidateHeaderActions>
            {application.featured && <FeaturedBadge />}
            <AdvisableComment comment={application.comment} />
          </CandidateHeaderActions>
        </CandidateHeader>
        <CandidateAttributes
          compact
          rate={currency(application.rate, project.currency)}
          availability="Yes"
          linkedin={application.specialist.linkedin}
        />

        <Text size="s" marginBottom="l">
          {application.introduction}
        </Text>

        <Button blank className="ViewMore" onClick={this.clickToExpand}>
          {this.state.expanded ? (
            <svg width={13} height={6}>
              <path
                d="M1.314 6l-.668-.6 6-5.4 6 5.4-.667.6-5.333-4.798z"
                fill="#76859A"
                fillRule="nonzero"
              />
            </svg>
          ) : (
            <svg width={13} height={7}>
              <path
                d="M1.314.293l-.668.6 6 5.4 6-5.4-.667-.6L6.646 5.09z"
                fill="#76859A"
                fillRule="nonzero"
              />
            </svg>
          )}
          {this.state.expanded ? "View Less" : "View More"}
        </Button>

        <Spring
          from={{ height: 0, opacity: 0 }}
          to={{
            height: this.state.expanded ? this.moreInfoHeight : 0,
            opacity: this.state.expanded ? 1 : 0
          }}
        >
          {styles => (
            <MoreInfo innerRef={c => (this.moreInfo = c)} style={styles}>
              <Questions questions={application.questions} />
              {application.specialist.skills.length > 0 && (
                <Spacing marginTop="xl">
                  <Skills skills={application.specialist.skills} />
                </Spacing>
              )}
            </MoreInfo>
          )}
        </Spring>

        {application.status === "Proposed" &&
          proposal && (
            <React.Fragment>
              <Divider marginTop="xl" marginBottom="xl" />
              <Button
                marginRight="m"
                onClick={() =>
                  this.props.history.push(`proposals/${proposal.id}`)
                }
                primary
              >
                View Proposal
              </Button>

              <Button
                type="button"
                onClick={() => this.setState({ modal: REJECT_PROPOSAL_MODAL })}
              >
                Reject
              </Button>

              <RejectProposalModal
                booking={proposal}
                specialist={application.specialist}
                isOpen={this.state.modal === REJECT_PROPOSAL_MODAL}
                onClose={() => this.setState({ modal: null })}
              />
            </React.Fragment>
          )}

        {application.status === "Application Accepted" && (
          <React.Fragment>
            <Divider marginTop="xl" marginBottom="xl" />
            <Button
              marginRight="m"
              onClick={() =>
                this.props.history.push(`applications/${application.id}/offer`)
              }
              primary
            >
              Send Offer
            </Button>
            <Button onClick={() => this.setState({ modal: "reject" })}>
              Provide Feedback
            </Button>
          </React.Fragment>
        )}

        {application.status === "Applied" && (
          <React.Fragment>
            <Divider marginTop="xl" marginBottom="xl" />
            <Button
              marginRight="m"
              onClick={() => this.setState({ modal: "introduction" })}
              primary
            >
              Request Call
            </Button>
            <Button onClick={() => this.setState({ modal: "reject" })}>
              Provide Feedback
            </Button>
          </React.Fragment>
        )}

        {["Application Accepted", "Proposed"].indexOf(application.status) >
          -1 && !application.referencesRequested && (
          <Button
            marginLeft="m"
            onClick={() => this.setState({ modal: REQUEST_REFERENCES_MODAL })}
          >
            Request References
          </Button>
        )}
      </Card>
    );
  }
}

export default withRouter(Candidate);
