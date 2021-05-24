import React from "react";
import truncate from "lodash/truncate";
import styled from "styled-components";
import { useParams } from "react-router";
import { Check } from "@styled-icons/heroicons-solid/Check";
import { Circle, Box, Text, Card, Button } from "@advisable/donut";
import CaseStudyContent from "src/components/CaseStudyContent";
import { useCaseStudy } from "./queries";
import Sticky from "react-stickynode";
import ActionBar from "./ActionBar";

const StyledHero = styled.div`
  width: 100%;
  height: 280px;
  background: #e1eef3;
  padding-bottom: 80px;
  display: flex;
  align-items: flex-end;
`;

const StyledArticleTitle = styled.h1`
  font-size: 36px;
  line-height: 40px;
  font-weight: 550;
  letter-spacing: -0.06rem;
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1000px;
  position: relative;
  padding-left: 300px;
`;

const StyledSidebar = styled.div`
  left: 0;
  top: -24px;
  width: 228px;
  z-index: 4;
  position: absolute;
`;

const StyledAvatar = styled.div`
  width: 200px;
  height: 260px;
  background: white;
  border-radius: 24px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.12);
`;

function CaseStudySummaryResults({ caseStudy }) {
  const outcomeSection = caseStudy.sections.find((s) => s.type === "outcome");
  if (!outcomeSection) return null;
  const resultsBlock = outcomeSection.contents.find(
    (c) => c.__typename === "Results",
  );
  if (!resultsBlock) return null;

  return (
    <Box paddingTop={4} paddingBottom={4}>
      {resultsBlock.results.map((result, index) => (
        <Box key={index} display="flex" alignItems="center" marginBottom={3}>
          <Circle size={20} marginRight={2} bg="cyan600" color="white">
            <Check size={12} />
          </Circle>
          <Text fontSize="lg" fontWeight="350">
            {result}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

export default function CaseStudy() {
  const { id, caseStudyId } = useParams();
  const { data, loading } = useCaseStudy({
    variables: { id: caseStudyId, searchId: id },
  });

  if (loading) return <>loading</>;
  const { caseStudySearch, caseStudy } = data;
  const { specialist } = caseStudy;

  return (
    <>
      <StyledHero>
        <Container>
          <StyledSidebar>
            <Sticky top={102} enabled>
              <StyledAvatar
                style={{ backgroundImage: `url(${specialist.avatar})` }}
              />
              <Text
                pt={6}
                pb={4}
                fontSize="3xl"
                fontWeight={550}
                letterSpacing="-0.03rem"
              >
                {specialist.name}
              </Text>
              <Text
                fontSize="sm"
                fontWeight={350}
                lineHeight="20px"
                paddingBottom={8}
              >
                {truncate(specialist.bio, { length: 180 })}
              </Text>
              <Button variant="gradient" size="l">
                Work with {specialist.firstName}
              </Button>
            </Sticky>
          </StyledSidebar>
          <StyledArticleTitle>{caseStudy.title}</StyledArticleTitle>
        </Container>
      </StyledHero>
      <Container>
        {caseStudy.comment ? (
          <Card marginTop="-32px" padding={5} borderRadius="16px">
            <Text fontSize="lg" lineHeight="20px" fontStyle="italic">
              &quot;{caseStudy.comment}&quot;
            </Text>
          </Card>
        ) : null}
        <Text
          fontSize="xl"
          lineHeight="28px"
          fontWeight={350}
          paddingTop={10}
          paddingBottom={6}
        >
          {caseStudy.subtitle}
        </Text>
        <CaseStudySummaryResults caseStudy={caseStudy} />
        <Box height="1px" bg="neutral200" marginY={8} />
        <CaseStudyContent caseStudy={caseStudy} />
        <ActionBar search={caseStudySearch} caseStudy={caseStudy} />
      </Container>
    </>
  );
}
