import React from "react";
import { use100vh } from "react-div-100vh";
import { StyledView, StyledViewContent, StyledSidebar } from "./styles";

function ViewContent({ children }) {
  return <StyledViewContent id="view">{children}</StyledViewContent>;
}

function ViewSidebar({ children, ...props }) {
  return <StyledSidebar {...props}>{children}</StyledSidebar>;
}

ViewSidebar.defaultProps = {
  width: "300px",
  padding: "24px",
};

function View({ children }) {
  const height = use100vh();
  return (
    <StyledView
      style={{
        height: height ? `${height - 58}px` : "100%",
      }}
    >
      {children}
    </StyledView>
  );
}

View.Sidebar = ViewSidebar;
View.Content = ViewContent;

export default View;
