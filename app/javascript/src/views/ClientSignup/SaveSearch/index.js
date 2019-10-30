import React from "react";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useMutation } from "react-apollo";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Card, Text, Button } from "@advisable/donut";
import { Header } from "../styles";
import Logo from "../../../components/Logo";
import CREATE_ACCOUNT from "./createAccount";
import Form from "./Form";

const SaveSearch = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [createAccount, { data }] = useMutation(CREATE_ACCOUNT);
  const [a, setA] = React.useState(false);

  const handleSubmit = async (values, formik) => {
    setA(true);
    return;
    const response = await createAccount({
      variables: {
        input: {
          skill: get(location, "state.search.skill"),
          industry: get(location, "state.search.industry"),
          industryExperienceRequired: get(
            location,
            "state.search.industryRequired"
          ),
          companyType: get(location, "state.search.companyType"),
          companyTypeExperienceRequired: get(
            location,
            "state.search.companyTypeRequired"
          ),
          email: values.email,
          specialists: location.state.selected,
        },
      },
    });

    formik.setSubmitting(false);

    if (response.errors) {
      const code = get(response.errors, "[0].extensions.code");
      if (code === "emailTaken") {
        formik.setFieldError("email", t("errors.emailTaken"));
      } else if (code === "nonCorporateEmail") {
        formik.setFieldError("email", t("errors.nonCorporateEmail"));
      } else {
        formik.setStatus("errors.somethingWentWrong");
      }
    }
  };

  const handleContinue = () => {
    const project = data.createUserAccount.project;
    let url = "https://advisable.com/apply-to-be-a-client/";
    url += `?pid=${project.airtableId}`;
    url += `&email=${encodeURIComponent(values.email)}`;
    url += `&skill=${get(location, "state.search.skill")}`;
    if (selected.length > 0) {
      url += `&specialists=${selected.join(",")}`;
    }
    window.location.replace(url);
  };

  return (
    <>
      <Header>
        <Logo />
      </Header>
      <Box maxWidth={500} margin="50px auto" position="relative">
        <AnimatePresence>
          {a ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.25 }}
            >
              <Card padding="l">
                <Text
                  fontSize="xxl"
                  fontWeight="semibold"
                  letterSpacing="-0.03rem"
                  color="neutral.9"
                  mb="xs"
                >
                  Tell us more
                </Text>
                <Text fontSize="s" color="neutral.7" lineHeight="s" mb="l">
                  Great! We think we’ll have the perfect person for this project
                  but we need to know a little bit more about your project
                  first.
                </Text>
                <Button
                  intent="success"
                  appearance="primary"
                  iconRight="arrow-right"
                  onClick={handleContinue}
                >
                  Setup Project
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="save"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60, position: "absolute" }}
              transition={{ ease: "easeOut", duration: 0.25 }}
            >
              <Card padding="l">
                <Form onSubmit={handleSubmit} />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
};

export default SaveSearch;
