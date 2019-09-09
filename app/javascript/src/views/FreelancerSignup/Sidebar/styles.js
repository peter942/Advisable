import styled from "styled-components";
import specialist from "./specialist.jpg";
import trustpilot from "./trustpilot.png";
import stars from "./stars.png";

export const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 16px;
  display: inline-block;
  background: url(${specialist}) no-repeat center / cover;
`;

export const TestimonialStyles = styled.div`
  margin: 0 auto;
  max-width: 340px;
  text-align: center;
  transform: translateY(-50px);
`;

export const Trustpilot = styled.div`
  width: 96px;
  height: 40px;
  display: block;
  margin: 0 auto 4px auto;
  background: url(${trustpilot}) no-repeat center / cover;
`;

export const Stars = styled.div`
  width: 124px;
  height: 22px;
  display: block;
  margin: 0 auto 12px auto;
  background: url(${stars}) no-repeat center / cover;
`;
