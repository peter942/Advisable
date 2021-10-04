import styled from "styled-components";
import { color, space, border, variant } from "styled-system";

const size = variant({
  prop: "size",
  variants: {
    xxs: {
      width: 24,
      height: 24,
    },
    xs: {
      width: 32,
      height: 32,
      fontSize: "12px",
    },
    s: {
      width: 40,
      height: 40,
      fontSize: "15px",
    },
    m: {
      width: 60,
      height: 60,
      fontSize: "18px",
    },
    l: {
      width: 80,
      height: 80,
    },
    xl: {
      width: 100,
      height: 100,
    },
    xxl: {
      width: 120,
      height: 120,
    },
  },
});

export const StyledAvatar = styled.div`
  ${size}
  ${space}
  ${border}
  ${color}

  border-radius: 50%;
  position: relative;
  display: inline-flex;
`;

export const StyledAvatarInitials = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: -1px;
  font-size: inherit;
  font-weight: 500;
  position: absolute;
  align-items: center;
  display: inline-flex;
  letter-spacing: -0.02em;
  justify-content: center;
  color: inherit;
`;

export const StyledAvatarImage = styled.div.attrs((props) => ({
  style: {
    backgroundImage: props.url && `url("${props.url}")`,
  },
}))`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  position: absolute;
  background-size: cover;
  background-position: center;
  opacity: ${(props) => (props.url ? 1 : 0)};
  transition: opacity 900ms;
`;

export default StyledAvatar;
