import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import client, { addToken } from "../../api/client";
import { RootState } from "../../app/store";
import User, { Credentials, Role } from "./User";
import Cookies from "universal-cookie";
export interface AuthState {
  logged: boolean;
  status: "init" | "idle" | "loading" | "failed";
  user?: User;
}

const initialState: AuthState = {
  logged: false,
  status: "init",
};

export const loginUser = createAsyncThunk<User, Credentials>(
  "auth/login",
  async (credentials: Credentials) => {
    const response = await client.post<User, AxiosResponse<User>, Credentials>(
      "login",
      credentials
    );

    return response.data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      /* Remove token z clienta */
      state.logged = false;
      state.user = undefined;
      const cookies = new Cookies();
      cookies.remove("user");
    },
    loginFromCookie: (state) => {
      if (state.user !== undefined) return;

      const cookies = new Cookies();

      if (cookies.get("user")) {
        const user = cookies.get("user") as User;
        state.logged = true;
        state.user = user;
        addToken(user.token);
      }
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "idle";
        state.user = action.payload;
        state.logged = true;
        const cookies = new Cookies();
        cookies.set("user", action.payload, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 3600),
        });
        addToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { logout, loginFromCookie } = authSlice.actions;

export const getIsLogged = (state: RootState) => state.auth.user !== undefined;
export const getUser = (state: RootState) => state.auth.user;
export const getToken = (state: RootState) => state.auth.user?.token;
export const isLogged = (state: RootState) => state.auth.logged;
export const getIsAdmin = (state: RootState) =>
  state.auth.user?.type === Role.ADMIN;
export default authSlice.reducer;
