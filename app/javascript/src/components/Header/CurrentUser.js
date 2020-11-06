import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Sentry from "@sentry/react";
import {
  CurrentUserWrapper,
  CurrentUserToggle,
  CurrentUserDropdown,
} from "./styles";

const CurrentUser = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const handleBlur = () => setOpen(false);
  const handleFocus = () => setOpen(true);
  let isClient = get(viewer, "__typename") === "User";
  let isAdmin = isClient && viewer?.isAdmin;

  React.useEffect(() => {
    if (!Sentry) return;
    if (user) {
      Sentry.configureScope((scope) => {
        scope.setUser({
          id: user.id,
          email: user.email,
          username: user.name,
        });
      });
    } else {
      Sentry.configureScope((scope) => {
        scope.setUser(null);
      });
    }
  });

  if (!user) return null;

  return (
    <CurrentUserWrapper tabIndex="0" onFocus={handleFocus} onBlur={handleBlur}>
      <CurrentUserToggle>
        <strong>{user.firstName}</strong>
        {user.companyName && <span>{user.companyName}</span>}
      </CurrentUserToggle>
      <CurrentUserDropdown open={open}>
        {user.guild && <a href="/guild">Guild</a>}
        {isClient && <Link to="/settings">Settings</Link>}
        {isAdmin && <a href="/admin">Admin</a>}
        <a href="#" onClick={onLogout}>
          Logout
        </a>
      </CurrentUserDropdown>
    </CurrentUserWrapper>
  );
};

export default CurrentUser;
