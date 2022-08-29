import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import styles from "./Layout.module.css";
const Layout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};

export default Layout;
