import styled from "styled-components";
import { theme, Box, Link } from "@advisable/donut";

export const Hamburger = styled.button`
  padding: 0;
  width: 20px;
  border: none;
  outline: none;
  display: block;
  appearance: none;
  position: relative;
  background: transparent;

  div {
    width: 100%;
    height: 2px;
    border-radius: 1px;
    margin-bottom: 5px;
    background: ${theme.colors.neutral900};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const CloseNav = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  appearance: none;
  background: white;
  position: relative;
  border-radius: 50%;
  margin-bottom: 12px;
  place-items: center;
  color: ${theme.colors.neutral900};
  border: 1px solid ${theme.colors.neutral500};
`;

export const StyledNav = styled.nav`
  display: flex;

  @media (max-width: ${theme.breakpoints.m}) {
    display: block;
  }
`;

export const NavItem = styled.a`
  font-size: 16px;
  cursor: pointer;
  font-weight: 480;
  align-items: center;
  user-select: none;
  margin-left: 32px;
  position: relative;
  display: inline-flex;
  text-decoration: none;
  letter-spacing: -0.016em;
  height: var(--header-height);
  color: ${theme.colors.neutral700};

  span {
    padding: 4px 0;
    background-size: 300% 100%;
    background-image: linear-gradient(
      116deg,
      #c32ad1 0%,
      ${theme.colors.blue600} 33%,
      ${theme.colors.neutral700} 66%,
      ${theme.colors.neutral700} 100%
    );

    background-position: 100% 0%;
    transition: background-position 200ms, opacity 200ms;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:hover span {
    opacity: 0.5;
    background-position: 0% 0%;
  }

  &.active span {
    opacity: 1;
    background-position: 0% 0%;
  }

  @media (max-width: ${theme.breakpoints.m}) {
    height: auto;
    padding: 20px 0;
    line-height: 1;
    display: block;
    font-size: 17px;
    font-weight: 500;
    margin-left: 0px;
    color: ${theme.colors.neutral700};
    border-bottom: 1px solid ${theme.colors.neutral200};

    &:hover {
      color: ${theme.colors.neutral900};
    }

    &.active {
      color: ${theme.colors.blue500};
      border-bottom: 1px solid ${theme.colors.neutral200};
    }
  }
`;

export const Badge = styled.div`
  color: white;
  height: 20px;
  display: inline-grid;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 550;
  margin-right: 8px;
  place-items: center;
  border-radius: 12px;
  letter-spacing: 0.04em;
  background: ${theme.colors.blue500};
`;

export const CurrentUserToggle = styled.div`
  cursor: pointer;
  display: flex;
  outline: none;
  align-items: center;
`;

export const Login = styled(Link)`
  color: white;
  cursor: pointer;
  border-radius: 6px;
  padding: 5px 10px;
  margin-left: auto;
  display: block;
  font-size: 15px;
  font-weight: 600;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

export const Logout = styled(Login)`
  font-weight: 500;
`;

export const StyledDropdown = styled(Box)`
  outline: none;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px -12px ${theme.colors.neutral900}24,
    0 2px 8px ${theme.colors.neutral900}12;
`;

export const StyledDropdownLink = styled.div`
  display: block;
  font-size: 16px;
  cursor: pointer;
  font-weight: 450;
  padding: 8px 20px;
  color: ${theme.colors.neutral600};

  &:hover {
    color: ${theme.colors.neutral900};
    background: ${theme.colors.neutral50};
  }
`;
