import React from "react";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import { useArticle } from "./queries";
import { useLocation } from "react-router-dom";
import { useBackground } from "@advisable/donut";
import Loading from "src/components/Loading";
import ErrorBoundary from "src/components/ErrorBoundary";
import NotFound, { isNotFound } from "src/views/NotFound";
import SpecialistCard from "./components/SpecialistCard";
import ArticleIntro from "./components/ArticleIntro";
import ArticleContent from "./components/ArticleContent";
import SpecialistBar from "./components/SpecialistBar";
import Footer from "src/components/Footer";
import ArticleEvents from "./components/ArticleEvents";
import CaseStudyArticleNew from "../CaseStudyArticleNew";

const SectionWrapper = ({ children, className, ...props }) => (
  <div
    className={`
          flex
          mx-auto
          px-6
          sm:px-8
          md:px-0
          lg:gap-10
          xl:gap-20
          w-full
          md:w-[696px]
          lg:w-[960px]
          xl:w-[1198px]
          ${className}
        `}
    {...props}
  >
    {children}
  </div>
);

export default function CaseStudyArticle({ topbarOffset }) {
  useBackground("beige");
  const location = useLocation();
  const { cs } = queryString.parse(location.search);
  const { data, loading, error } = useArticle();

  if (loading) return <Loading />;
  if (isNotFound(error)) return <NotFound />;

  if (cs == 2) return <CaseStudyArticleNew />;

  return (
    <ErrorBoundary>
      {data?.caseStudy && (
        <Helmet>
          <title>Advisable | {data.caseStudy?.title}</title>
        </Helmet>
      )}
      {data?.caseStudy && <ArticleEvents article={data?.caseStudy} />}
      <SpecialistBar article={data.caseStudy} offset={topbarOffset} />
      <div className="pt-10 pb-36">
        <SectionWrapper className="items-start">
          <SpecialistCard
            specialist={data.caseStudy.specialist}
            article={data.caseStudy}
          />
          <ArticleIntro caseStudy={data.caseStudy} />
        </SectionWrapper>
        <hr className="border-neutral200 pb-[3px] my-20" />
        <SectionWrapper id="content">
          <ArticleContent caseStudy={data.caseStudy} />
        </SectionWrapper>
      </div>
      <Footer />
    </ErrorBoundary>
  );
}
