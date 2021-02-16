import { gql } from "@apollo/client";

export default gql`
  query getPaymentSettings {
    currentCompany {
      id
      bankTransfersEnabled
    }
    viewer {
      ... on User {
        id
        projectPaymentMethod
        name
        companyName
        country {
          id
        }
        invoiceSettings {
          name
          companyName
          billingEmail
          vatNumber
          address {
            line1
            line2
            city
            state
            country
            postcode
          }
        }
        paymentMethod {
          id
          brand
          last4
          expMonth
          expYear
        }
      }
    }
  }
`;
