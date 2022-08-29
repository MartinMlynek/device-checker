import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import PhonePage from "./features/phones/PhonePage";
import { fetchPhones } from "./features/phones/phonesSlice";
import Layout from "./UI/Layout";
import LogoutPage from "./features/auth/LogoutPage";

import { loginFromCookie } from "./features/auth/authSlice";
import CreatePhonePage from "./features/phones/CreatePhonePage";
import ProtectedRoute from "./Routes/ProtectedRoute";
import AdminRoute from "./Routes/AdminRoute";

const container = document.getElementById("root")!;
const root = createRoot(container);
store.dispatch(fetchPhones());
store.dispatch(loginFromCookie());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" />} />

            <Route path="/phones">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <PhonePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="add"
                element={
                  <AdminRoute>
                    <CreatePhonePage />
                  </AdminRoute>
                }
              />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
