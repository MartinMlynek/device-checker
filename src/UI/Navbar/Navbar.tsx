import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks/redux-hooks";
import {
  getIsAdmin,
  getIsLogged,
  getUser,
} from "../../features/auth/authSlice";
import styles from "./Navbar.module.css";
import settings from "../../images/settings.png";
const Navbar = () => {
  const logged = useAppSelector(getIsLogged);
  const user = useAppSelector(getUser);
  const isAdmin = useAppSelector(getIsAdmin);
  return (
    <nav className={styles.nav}>
      <div className={styles.titleBox}>
        <img src={settings} alt="logo" />
        <h1>Device checker</h1>
      </div>
      <ul className={styles.menu}>
        <span> {user?.name}</span>

        {logged && (
          <li>
            <Link to={"/phones"}>Telefony</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to={"/phones/add"}>Přidat Telefon</Link>
          </li>
        )}
        <li>
          {logged ? (
            <Link to={"/logout"}>Odhlášení</Link>
          ) : (
            <Link to={"/login"}>Přihlášení</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
