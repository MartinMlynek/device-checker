import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import phonesReducer from "../features/phones/phonesSlice";
import authReducer from "../features/auth/authSlice";
export const store = configureStore({
  reducer: {
    phones: phonesReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;