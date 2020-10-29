import React from "react";
import { gql } from "@apollo/client";
import { get } from "lodash-es";
import { VisuallyHidden } from "reakit/VisuallyHidden";
import { useQuery } from "@apollo/client";
import { connect, Field } from "formik";
import { Box, Input, Select, Label, FieldError } from "@advisable/donut";
import { useBreakpoint } from "@advisable/donut";

export const addressFieldsFragment = gql`
  fragment AddressFieldsFragment on Country {
    id
    name
    code
  }
`;

const GET_DATA = gql`
  query getCountries {
    countries {
      ...AddressFieldsFragment
    }
  }

  ${addressFieldsFragment}
`;

const AddressFields = ({ label, name, formik }) => {
  const { data, loading } = useQuery(GET_DATA);
  const countries = data?.countries || [];
  const isWidescreen = useBreakpoint("sUp");

  if (loading) return <>loading...</>;

  const touched = get(formik.touched, name);
  const errors = get(formik.errors, name);

  const line1Error = touched?.line1 && errors?.line1;
  const line2Error = touched?.line2 && errors?.line2;
  const cityError = touched?.city && errors?.city;
  const stateError = touched?.state && errors?.state;
  const countryError = touched?.country && errors?.country;
  const postcodeError = touched?.postcode && errors?.postcode;
  const error =
    line1Error ||
    line2Error ||
    cityError ||
    stateError ||
    countryError ||
    postcodeError;

  return (
    <>
      {label && <Label mb="xs">{label}</Label>}
      <Field
        as={Input}
        marginBottom="xxs"
        name={`${name}.line1`}
        placeholder="Line 1"
        error={line1Error}
      />
      <Field
        as={Input}
        marginBottom="xxs"
        name={`${name}.line2`}
        placeholder="Line 2"
        error={line2Error}
      />
      <Box display={isWidescreen ? "flex" : undefined}>
        <Field
          as={Input}
          marginRight="xxs"
          name={`${name}.city`}
          placeholder="City"
          error={cityError}
          marginBottom="xxs"
        />
        <Field
          as={Input}
          name={`${name}.state`}
          placeholder="State"
          error={stateError}
          marginBottom="xxs"
        />
      </Box>
      <Box mb="xs" display={isWidescreen ? "flex" : undefined}>
        <Box
          width="100%"
          mb={!isWidescreen && "xxs"}
          mr={isWidescreen && "xxs"}
        >
          <VisuallyHidden>
            <label htmlFor={`${name}.country`}>Country</label>
          </VisuallyHidden>
          <Field
            as={Select}
            error={countryError}
            id={`${name}.country`}
            name={`${name}.country`}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Field>
        </Box>
        <Field
          as={Input}
          placeholder="Postcode"
          name={`${name}.postcode`}
          error={postcodeError}
        />
      </Box>
      {error && <FieldError>{error}</FieldError>}
    </>
  );
};

export default connect(AddressFields);
