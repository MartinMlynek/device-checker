import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import client, { isTokenAdded } from "../../api/client";
import { RootState } from "../../app/store";
import Phone from "./PhoneModel";

export interface PhonesState {
  phones: Phone[];
  operatingSystems: string[];
  vendors: string[];
  status: "idle" | "loading" | "failed";
}

const initialState: PhonesState = {
  phones: [],
  operatingSystems: [],
  vendors: [],
  status: "idle",
};

export const fetchPhones = createAsyncThunk<Phone[], void>(
  "phones/fetchPhones",
  async () => {
    const response = await client.get<Phone[]>("/phones");
    return response.data;
  },
  {
    condition: isTokenAdded,
  }
);

export const addPhone = createAsyncThunk<Phone, Omit<Phone, "id">>(
  "phones/addPhone",
  async (phone) => {
    const response = await client.post<
      Phone,
      AxiosResponse<Phone>,
      Omit<Phone, "id">
    >("/phones", phone);
    return response.data;
  },
  {
    condition: isTokenAdded,
  }
);

export const borrowPhone = createAsyncThunk<Phone, string>(
  "phones/borrowPhone",
  async (idPhone) => {
    const response = await client.post<Phone>(`/phones/${idPhone}/borrow`);
    return response.data;
  },
  {
    condition: isTokenAdded,
  }
);
export const returnPhone = createAsyncThunk<Phone, string>(
  "phones/returnPhone",
  async (idPhone) => {
    const response = await client.post<Phone>(`/phones/${idPhone}/return`);
    return response.data;
  },
  {
    condition: isTokenAdded,
  }
);

export const phonesSlice = createSlice({
  name: "phones",
  initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      /* Všechny telefony */
      .addCase(fetchPhones.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPhones.fulfilled, (state, action) => {
        state.status = "idle";
        state.phones = action.payload;
        state.operatingSystems = [...new Set(action.payload.map((a) => a.os))];
        state.vendors = [...new Set(action.payload.map((a) => a.vendor))];
      })
      .addCase(fetchPhones.rejected, (state) => {
        state.status = "failed";
      })

      /* Půjčení telefonu */
      .addCase(borrowPhone.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(borrowPhone.pending, (state) => {
        state.status = "loading";
      })
      .addCase(borrowPhone.fulfilled, (state, action) => {
        state.status = "idle";
        const phone = action.payload;

        state.phones = state.phones.map((oldPhone) => {
          return oldPhone.id === phone.id ? phone : oldPhone;
        });
      })

      /* Vrácení telefonu */
      .addCase(returnPhone.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(returnPhone.pending, (state) => {
        state.status = "loading";
      })
      .addCase(returnPhone.fulfilled, (state, action) => {
        state.status = "idle";
        const phone = action.payload;

        state.phones = state.phones.map((oldPhone) => {
          return oldPhone.id === phone.id ? phone : oldPhone;
        });
      })

      /* Přidání telefonu */
      .addCase(addPhone.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addPhone.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPhone.fulfilled, (state, action) => {
        state.status = "idle";
        const phone = action.payload;
        state.phones.push(phone);
      });
  },
});

export const getAllPhones = (state: RootState) => state.phones.phones;
export const getAllVendors = (state: RootState) => state.phones.vendors;
export const getAllOs = (state: RootState) => state.phones.operatingSystems;

export default phonesSlice.reducer;
