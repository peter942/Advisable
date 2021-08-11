import React, { useLayoutEffect } from "react";
import { Box, useTheme } from "@advisable/donut";
import Loading from "src/components/Loading";
import NotFound, { isNotFound } from "src/views/NotFound";
import CoverPhoto from "./components/CoverPhoto";
import Sidebar from "./components/Sidebar";
import { useProfileData } from "./queries";
import CaseStudies from "./components/CaseStudies";
import Testimonials from "./components/Testimonials";

export default function FreelancerProfileNew() {
  const { loading, data, error } = useProfileData();
  const theme = useTheme();

  // Set background color to white
  useLayoutEffect(() => {
    theme.updateTheme({ background: "white" });
    return () => theme.updateTheme({ background: "default" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;
  if (isNotFound(error)) return <NotFound />;

  return (
    <Box
      pt={7}
      pb={10}
      mx={["12px", "32px", "32px", "auto"]}
      maxWidth={{ _: "100%", l: "1080px" }}
    >
      <CoverPhoto />
      <Box display="flex">
        <Sidebar data={data} />
        <Box>
          <CaseStudies />
          <Testimonials />
        </Box>
      </Box>
    </Box>
  );
}
