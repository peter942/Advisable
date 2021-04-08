import React, { useMemo, useCallback } from "react";
import { Box, Select, Button } from "@advisable/donut";
import { Trash } from "@styled-icons/heroicons-solid/Trash";
import FilterValue from "./filters";
import { StyledFilter } from "./styles";

function FilterAttribute({ value, resource, onChange }) {
  const withFilters = useMemo(
    () => resource.attributes.filter((a) => a.filters.length),
    [resource],
  );

  const handleChange = useCallback(
    (e) => {
      const attribute = withFilters.find((a) => a.name === e.target.value);
      onChange(attribute);
    },
    [withFilters, onChange],
  );

  return (
    <Select value={value} onChange={handleChange}>
      {withFilters.map((attr) => (
        <option key={attr.name}>{attr.name}</option>
      ))}
    </Select>
  );
}

function FilterType({ filter, resource, onChange }) {
  const attribute = useMemo(() => {
    return resource.attributes.find((a) => a.name === filter.attribute);
  }, [filter.attribute, resource]);

  const handleChange = useCallback(
    (e) => {
      const filter = attribute.filters.find((f) => f.name === e.target.value);
      onChange(filter);
    },
    [attribute, onChange],
  );

  return (
    <Select size="s" value={filter.type} onChange={handleChange}>
      {attribute.filters.map((filter) => (
        <option key={filter.name}>{filter.name}</option>
      ))}
    </Select>
  );
}

export default function Filter({
  index,
  resource,
  schemaData,
  filter,
  onUpdate,
  onRemove,
}) {
  const handleChangeAttribute = (attribute) => {
    onUpdate(index, {
      attribute: attribute.name,
      type: attribute.filters[0].name,
      value: [],
    });
  };

  const handleChangeType = (attributeFilter) => {
    onUpdate(index, {
      ...filter,
      type: attributeFilter.name,
      value: [],
    });
  };

  const handleChangeValue = (value) => {
    onUpdate(index, {
      ...filter,
      value,
    });
  };

  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <StyledFilter borderRadius="12px" bg="neutral100" padding={2}>
      <Box display="flex" mb={2}>
        <Box pr={1} width="50%">
          <FilterAttribute
            value={filter.attribute}
            resource={resource}
            onChange={handleChangeAttribute}
          />
        </Box>
        <Box pl={1} width="50%">
          <FilterType
            filter={filter}
            resource={resource}
            onChange={handleChangeType}
          />
        </Box>
      </Box>
      <FilterValue
        schemaData={schemaData}
        resource={resource}
        filter={filter}
        onChange={handleChangeValue}
      />
      <Button
        mt={2}
        prefix={<Trash />}
        size="xs"
        variant="subtle"
        onClick={handleRemove}
      >
        Remove
      </Button>
    </StyledFilter>
  );
}
