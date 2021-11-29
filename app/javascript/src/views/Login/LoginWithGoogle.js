import React from "react";
import { Google } from "@styled-icons/fa-brands/Google";
import { StyledLoginWithGoogle } from "./styles";

export default function LoginWithGoogle() {
  const csrf = document
    .querySelector("meta[name=csrf-token]")
    ?.getAttribute("content");

  // mode can be user or specialist
  return (
    <form action="/auth/google_oauth2?mode=user" method="POST">
      <input type="hidden" name="authenticity_token" value={csrf} />
      <StyledLoginWithGoogle $buttonSize="l" type="submit">
        <Google />
        Login with Google
      </StyledLoginWithGoogle>
    </form>
  );
}
