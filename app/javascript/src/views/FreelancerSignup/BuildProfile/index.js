import React from "react";
import { get } from "lodash-es";
import { gql } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import {
  Button,
  Text,
  Box,
  Checkbox,
  Textarea,
  Input,
  Select,
  Label,
} from "@advisable/donut";
import { useQuery, useMutation } from "@apollo/client";
import FormField from "components/FormField";
import Avatar from "../../../components/Avatar";
import FileUpload from "../../../components/FileUpload";
import UPDATE_PROFILE from "../updateProfile";
import validationSchema from "./validationSchema";
import { ArrowRight } from "@styled-icons/feather";

export const GET_COUNTRIES = gql`
  {
    countries {
      value: id
      label: name
    }
  }
`;

const BuildProfile = ({ history, specialist }) => {
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const countriesQuery = useQuery(GET_COUNTRIES);
  const [profilePhoto, setProfilePhoto] = React.useState(
    get(specialist, "avatar"),
  );

  const handleSubmit = async (values) => {
    await updateProfile({
      variables: {
        input: values,
      },
    });

    history.push("/freelancers/signup/work");
  };

  const initialValues = {
    avatar: undefined,
    bio: specialist.bio || "",
    city: specialist.city || "",
    country: get(specialist, "country.id"),
    publicUse: specialist.publicUse === null ? true : specialist.publicUse,
  };

  if (countriesQuery.loading) {
    return <>loading...</>;
  }

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form>
          <Text as="h2" size="xxxl" weight="semibold" color="neutral900" mb="s">
            Build your profile
          </Text>
          <Text size="s" color="neutral700" lineHeight="m">
            This information will be shared with clients when you apply to
            projects. You can update your profile in your user settings.
          </Text>
          <Box bg="neutral100" width="100%" height="1px" my="l" />
          <Box mb="m">
            <Text size="s" color="neutral800" mb="xs" weight="medium">
              Proile photo
            </Text>
            <FileUpload
              onChange={(blob) => {
                formik.setFieldValue("avatar", blob.signed_id);
              }}
              preview={(file) => {
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => setProfilePhoto(e.target.result);
                  reader.readAsDataURL(file);
                }
                return (
                  <Avatar name={specialist.name} url={profilePhoto} size="m" />
                );
              }}
              label="Upload a profile photo"
            />
          </Box>
          <FormField
            name="bio"
            as={Textarea}
            marginBottom="m"
            label="Add a short bio"
            placeholder="Write a short introduction"
          />
          <Label marginBottom="xs">Where are you based?</Label>
          <Box mb="m" display="flex">
            <Box flex={1} pr="xxs">
              <Field
                as={Input}
                name="city"
                placeholder="City"
                error={formik.touched.city && formik.errors.city}
              />
            </Box>
            <Box flex={1} pl="xxs">
              <Field
                as={Select}
                name="country"
                placeholder="Country"
                data-testid="country"
                options={countriesQuery.data.countries}
                error={formik.touched.country && formik.errors.country}
              >
                {countriesQuery.data.countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Field>
            </Box>
          </Box>
          <Box mb="l">
            <Field as={Checkbox} type="checkbox" name="publicUse">
              I’m okay with Advisable using my profile to promote me publicly on
              advisable.com
            </Field>
          </Box>
          <Button
            size="l"
            type="submit"
            suffix={<ArrowRight />}
            loading={formik.isSubmitting}
          >
            Continue
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default BuildProfile;
