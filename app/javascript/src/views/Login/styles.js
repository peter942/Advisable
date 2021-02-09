import styled from "styled-components";
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
