import React from "react";
import { Box, Text, Button } from "@advisable/donut";
import PaymentMethod from "../../../../components/PaymentMethod";

const CardPaymentSettings = ({ paymentMethod, openCardModal }) => {
  return (
    <Box mb="l">
      {Boolean(paymentMethod) && (
        <>
          <Text
            mb="xxs"
            fontSize="l"
            color="neutral900"
            fontWeight="medium"
            letterSpacing="-0.02rem"
          >
            Card Details
          </Text>
          <Text fontSize="s" color="neutral800" mb="s">
            This card will be charged in order to collect payment for
            freelancers.
          </Text>
          <PaymentMethod paymentMethod={paymentMethod} />
          <Button
            mt="xs"
            type="button"
            variant="subtle"
            onClick={openCardModal}
          >
            Update card details
          </Button>
        </>
      )}

      {!paymentMethod && (
        <>
          <Text
            mb="xxs"
            fontSize="l"
            color="neutral900"
            fontWeight="medium"
            letterSpacing="-0.02rem"
          >
            Card Details
          </Text>
          <Text fontSize="s" color="neutral700" mb="s">
            You have not added any card details yet.
          </Text>
          <Button size="s" type="button" variant="dark" onClick={openCardModal}>
            Add a card
          </Button>
        </>
      )}

      <Box height={1} bg="neutral100" my="l" />
    </Box>
  );
};

export default CardPaymentSettings;
