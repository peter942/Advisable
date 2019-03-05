import styled, { css } from "styled-components";
import { breakpoints } from "src/utilities/screenSizes";

let Layout = styled.div`
  width: 100%;
  display: flex;
  margin: 0 auto;
  max-width: 1020px;
  padding-top: 40px;
  padding-bottom: 40px;

  ${breakpoints.small(css`
    padding: 0;
  `)};
`;

const sidebarWidths = {
  s: "200px",
  m: "300px",
}

let Sidebar = styled.div`
  flex-shrink: 0;
  margin-right: 50px;
  width: ${props => sidebarWidths[props.size || "m"]};
`;

let Main = styled.div`
  width: 100%;
  flex-grow: 1;
`;

Layout.Sidebar = Sidebar;
Layout.Main = Main;

export default Layout;
