import React from "react";
import { Box, Heading, Stack } from "@advisable/donut";
import Loading from "src/components/Loading";
import NoShortlists from "../components/NoShortlists";
import { useShortlists } from "../queries";
import ShortlistCard from "../components/ShortlistCard";

export default function Shortlists() {
  const { data, loading, error } = useShortlists();
  if (error) return <>error</>;

  const company = data?.currentCompany;
  const shortlists = data?.interests || [];

  return (
    <>
      <Box
        display="flex"
        height="40px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading
          fontSize={{ _: "28px", m: "36px" }}
          fontWeight={650}
          letterSpacing="-0.06rem"
        >
          Discover
        </Heading>
      </Box>
      <Box height="1px" bg="neutral100" my={8} />
      {!loading && shortlists.length === 0 && <NoShortlists />}
      {!loading && shortlists.length > 0 && (
        <Stack spacing={8} divider="neutral100">
          {shortlists.map((shortlist) => (
            <ShortlistCard
              key={shortlist.id}
              shortlist={shortlist}
              company={company}
            />
          ))}
        </Stack>
      )}
      {loading && <Loading />}
    </>
  );
}
