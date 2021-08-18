import { gql, useQuery } from "@apollo/client";

export const QUERY_INVOICES = gql`
  query getInvoices {
    viewer {
      ... on User {
        id
        invoices {
          id
          number
          issuedAt
          status
          amount
        }
      }
    }
  }
`;

export const useInvoices = () => useQuery(QUERY_INVOICES);

export const GET_INVOICE = gql`
  query getInvoice($id: ID!) {
    invoice(id: $id) {
      # Head
      issuedAt
      number
      status
      # Billed to
      customerName
      customerAddress {
        postcode
        city
        state
        country
        line1
        line2
      }
      # Note
      description
      # Title
      lineItems {
        id
        title
        quantity
        unitPrice
      }
      # Amount Due
      amount
      # Buttons
      downloadUrl
      paymentUrl
    }
  }
`;

export const useGetInvoices = (id) =>
  useQuery(GET_INVOICE, { variables: { id } });
