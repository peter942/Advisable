import React, { useCallback, useEffect } from "react";
import { useDialogState } from "reakit/Dialog";
import { Formik, Form } from "formik";
import { Modal, Box, Text, Tag } from "@advisable/donut";
import { useNotifications } from "src/components/Notifications";
import SubmitButton from "src/components/SubmitButton";
import { useNavigate, useLocation, useMatch } from "react-router";
import {
  attributeFormValueInitializer,
  AttributeInput,
} from "../../../attributes";
import {
  generateShowQuery,
  generateUpdateMutation,
  resourcePath,
} from "../../../utilities";
import { useMutation, useQuery } from "@apollo/client";
import VersionHistory from "./VersionHistory";
import ActionsMenu from "./ActionsMenu";
import { isEqual } from "lodash-es";
import { useToby } from "../../../components/TobyProvider";

function useRoutedModal(path, returnPath) {
  const modal = useDialogState();
  const navigate = useNavigate();
  const location = useLocation();
  const match = useMatch(path);

  useEffect(() => {
    if (modal.visible && !match) {
      modal.hide();
    }

    if (!modal.visible && match) {
      modal.show();
    }
  }, [modal, match]);

  const handleShow = useCallback(() => {
    navigate(path);
  }, [history, path]);

  const handleHide = useCallback(() => {
    navigate(returnPath, {
      state: location.state,
    });
  }, [location, history, returnPath]);

  return {
    ...modal,
    params: match?.params || {},
    show: handleShow,
    hide: handleHide,
  };
}

function History({ resource }) {
  return (
    <Box
      width={300}
      flexShrink={0}
      maxHeight="100%"
      bg="neutral100"
      borderRadius="12px"
      padding={4}
    >
      <VersionHistory resource={resource} />
    </Box>
  );
}

function Details({ id, resource }) {
  const toby = useToby();
  const { error, notify } = useNotifications();
  const updateMutation = generateUpdateMutation(toby, resource);
  const query = generateShowQuery(toby, resource);
  const [update] = useMutation(updateMutation);
  const { data, loading } = useQuery(query, {
    variables: {
      id,
    },
  });

  if (loading) return <>loading...</>;

  const initialValues = {};
  const writeableAttributes = resource.attributes.filter((a) => !a.readonly);
  writeableAttributes.forEach((attr) => {
    const initializer = attributeFormValueInitializer(attr);
    if (initializer) {
      initialValues[attr.name] = initializer(data.record, attr);
    }
  });

  const handleSubmit = async (attributes, formik) => {
    const valuesToSubmit = Object.keys(initialValues).reduce((acc, key) => {
      const initial = initialValues[key];
      const value = attributes[key];
      if (!isEqual(initial, value)) {
        acc[key] = value;
      }

      return acc;
    }, {});

    const { errors } = await update({
      variables: {
        id,
        attributes: valuesToSubmit,
      },
    });

    if (errors) {
      const activeRecordErrors = errors[0]?.extensions?.errors || [];

      const fieldErrors = Object.keys(activeRecordErrors).reduce(
        (collection, key) => {
          return {
            ...collection,
            [key]: activeRecordErrors[key][0],
          };
        },
        {},
      );
      formik.setErrors(fieldErrors);
      error("Failed to save record");
    } else {
      notify("Your changes have been saved");
      formik.resetForm({
        values: { ...initialValues, ...valuesToSubmit },
      });
    }
  };

  return (
    <Box display="flex">
      <Box paddingRight={8} width="100%">
        <Box display="flex" alignItems="center">
          <ActionsMenu resource={resource} record={data.record} />
        </Box>
        <Formik onSubmit={handleSubmit} initialValues={initialValues}>
          <Form>
            {resource.attributes.map((attr) => {
              return (
                <Box key={attr.name} mb={5}>
                  <Box
                    mb={2}
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Text fontWeight={500} as="span">
                      {attr.columnLabel}
                    </Text>
                    {attr.readonly && (
                      <Tag ml={2} size="xs">
                        Readonly
                      </Tag>
                    )}
                  </Box>
                  {attr.description && (
                    <Text
                      fontSize="sm"
                      lineHeight="20px"
                      color="neutral800"
                      marginBottom={3}
                    >
                      {attr.description}
                    </Text>
                  )}
                  <AttributeInput
                    resource={resource}
                    record={data.record}
                    attribute={attr}
                  />
                  <Box mt={5} height={1} bg="neutral100" />
                </Box>
              );
            })}
            <SubmitButton mt={4}>Save Changes</SubmitButton>
          </Form>
        </Formik>
      </Box>
      <History resource={data.record} />
    </Box>
  );
}

export default function DetailsModal({ resource }) {
  const match = useMatch("/:resource/:id");

  const modal = useRoutedModal("/:resource/:id", resourcePath(resource));

  return (
    <Modal width={1000} modal={modal} label="Details">
      {match?.params?.id && (
        <Details id={match.params.id} resource={resource} />
      )}
    </Modal>
  );
}
