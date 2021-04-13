import React, { useCallback, useEffect, useMemo, useState } from "react";
import queryString from "query-string";
import { Box, Button } from "@advisable/donut";
import { Adjustments } from "@styled-icons/heroicons-solid/Adjustments";
import { motion } from "framer-motion";
import { useHistory, useLocation } from "react-router-dom";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useFetchResources } from "../../utilities";
import {
  StyledLayout,
  StyledHeader,
  StyledHeaderRow,
  StyledHeaderCell,
  StyledRow,
  StyledCell,
  StyledViewport,
  StyledScrollContainer,
} from "../../styles";
import FilterDrawer from "./Filters";
import Navigation from "../../components/Navigation";
import { Attribute } from "../../attributes";
import DetailsModal from "./DetailsModal";
import LoadingIndicator from "src/components/Loading";
import Loading from "./Loading";
import { useResourceViews, useUpdateViewFilter } from "../../queries";

export default function ResourceConfig({ resource }) {
  const { loading, data } = useResourceViews(resource.type);
  if (loading) return <LoadingIndicator />;

  return <Resource resource={resource} views={data.views} />;
}

function initializeViewFilters(view) {
  if (!view) return [];

  return (
    view.filters.map((f) => ({
      attribute: f.attribute,
      type: f.type,
      value: f.value,
    })) || []
  );
}

function Resource({ resource, views }) {
  const history = useHistory();
  const location = useLocation();
  const [updateViewFilters] = useUpdateViewFilter();

  const currentView = useMemo(() => {
    const queryParams = queryString.parse(location.search);
    if (!queryParams.view) return null;
    return views.find((v) => v.id === queryParams.view);
  }, [views, location.search]);

  const [filters, setFilters] = useState(initializeViewFilters(currentView));

  const [isOpen, setIsOpen] = useState(false);
  const { loading, data, fetchMore, error } = useFetchResources(
    resource,
    filters,
  );

  const hasNextPage = data?.records.pageInfo.hasNextPage;
  const endCursor = data?.records.pageInfo.endCursor;

  useEffect(() => {
    setFilters(initializeViewFilters(currentView));
  }, [currentView]);

  const scrollRef = useBottomScrollListener(() => {
    if (!loading && !hasNextPage) return;
    fetchMore({ variables: { cursor: endCursor } });
  });

  const edges = data?.records.edges || [];

  if (error) {
    return <>Failed to load {resource.type}</>;
  }

  const openRecord = (id) => () => {
    history.push({
      ...location,
      pathname: `${location.pathname}/${id}`,
    });
  };

  const updateFilters = useCallback(
    (filters) => {
      setFilters(filters);

      if (currentView) {
        updateViewFilters({
          variables: {
            id: currentView.id,
            filters,
          },
        });
      }
    },
    [currentView, updateViewFilters],
  );

  return (
    <StyledLayout>
      <DetailsModal resource={resource} />
      <StyledHeader>
        <Navigation />
        <Button
          ml={2}
          mt={2}
          size="s"
          prefix={<Adjustments />}
          variant="subtle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close Filters" : "Open filters"}
          {filters.length ? ` (${filters.length})` : null}
        </Button>
      </StyledHeader>
      <StyledViewport>
        <FilterDrawer
          views={views}
          resource={resource}
          open={isOpen}
          filters={filters}
          onApply={updateFilters}
        />
        <StyledScrollContainer
          ref={scrollRef}
          as={motion.div}
          transition={{ duration: 0.2 }}
          animate={{ x: isOpen ? 400 : 0 }}
        >
          {/* Dear future developer. I know this inline-block looks random. But its important. */}
          <Box display="inline-block" minWidth="100vw">
            <StyledHeaderRow>
              {resource.attributes.map((attr) => (
                <StyledHeaderCell key={attr.name}>
                  {attr.columnLabel}
                </StyledHeaderCell>
              ))}
            </StyledHeaderRow>
            <Box>
              {edges.map(({ node }) => (
                <StyledRow key={node.id} onClick={openRecord(node.id)}>
                  {resource.attributes.map((attr) => (
                    <StyledCell key={attr.name}>
                      <Attribute record={node} attribute={attr} />
                    </StyledCell>
                  ))}
                </StyledRow>
              ))}
              {loading && <Loading resource={resource} />}
            </Box>
          </Box>
        </StyledScrollContainer>
      </StyledViewport>
    </StyledLayout>
  );
}
