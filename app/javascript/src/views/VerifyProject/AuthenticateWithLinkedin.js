import React from "react";
import { Box, Text, Link } from "@advisable/donut";
import LoginWithLinkedin from "./LoginWithLinkedin";

function AuthenticateWithLinkedin({ data }) {
  const isValidated = data.previousProject.validationStatus === "Validated";
  const isReviewed = !!data.previousProject.reviews.length;

  return (
    <Box
      bg="blue50"
      padding={{ _: "20px", m: "40px" }}
      textAlign="center"
      borderRadius="20px"
    >
      <Text
        mb="20px"
        fontSize="17px"
        color="blue900"
        lineHeight="22px"
        fontWeight="medium"
      >
        Please login with LinkedIn to unlock the full details and{" "}
        {isValidated && !isReviewed ? "review" : "verify"} this project
      </Text>
      <LoginWithLinkedin />
      <Text fontWeight="medium" mt="24px" mb="xs">
        Don&apos;t have a LinkedIn account?
      </Text>
      <Link.External
        href={`mailto:hello@advisable.com?subject=${data.previousProject.title}(${data.previousProject.id})&body=Hi there, I'd like to validate this project via email.`}
      >
        Verify with email
      </Link.External>
    </Box>
  );
}

export default AuthenticateWithLinkedin;
