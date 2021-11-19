import { display } from "styled-system";
import styled from "styled-components";
import StyledBox from "../Box/styles";

export const StyledCircle = styled(StyledBox)`
  border-radius: 50%;
  align-items: center;
  display: inline-flex;
  justify-content: center;
  ${display}
`;

export default StyledCircle;
