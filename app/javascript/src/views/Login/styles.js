import styled from "styled-components";
import { Link } from "react-router-dom";
import { theme, StyledButton } from "@advisable/donut";

export const Container = styled.div`
  width: 96%;
  margin: 0 auto;
  max-width: 500px;

  .Logo {
    width: 120px;
    display: block;
    margin: 60px auto 40px auto;
  }
`;

export const Card = styled.div`
  padding: 40px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0px 15px 50px rgba(20, 41, 116, 0.09);
`;

export const Error = styled.div`
  width: 100%;
  padding: 10px;
  color: #ff0073;
  display: block;
  font-size: 14px;
  margin-top: 15px;
  border-radius: 4px;
  text-align: center;
  display: inline-block;
  border: 1px solid #ff0073;
`;

export const SignupLinks = styled.div`
  margin-bottom: 50px;
`;

export const SignupLink = styled(Link)`
  flex-grow: 1;
  display: block;
  font-size: 14px;
  font-weight: 400;
  padding: 16px 20px;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  color: ${theme.colors.neutral700};
  border: 1px solid ${theme.colors.neutral200};
  margin-bottom: 10px;

  &:hover {
    color: ${theme.colors.neutral800};
    border-color: ${theme.colors.neutral300};
  }
`;

export const StyledLoginWithGoogle = styled(StyledButton)`
  width: 100%;
  background: ${theme.colors.neutral800};

  &:not(:disabled):hover {
    background: ${theme.colors.neutral900};
  }

  svg {
    width: 20px;
    margin-right: 12px;
  }
`;
