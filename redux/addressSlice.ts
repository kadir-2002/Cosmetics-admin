// import AddressDataType from "@/types/AddressDataType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressState {
  addresses:any;
  selectedAddress:any;
}


const initialState: AddressState = {
  addresses: [],
  selectedAddress: [],
};

export const userAddressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    saveAddresses: (
      state,
      action: PayloadAction<{ addresses:any }>
    ) => {
      state.addresses = [...action.payload.addresses];
    },
    saveSelectedAddress: (
      state,
      action: PayloadAction<{ selectedAddress:any }>
    ) => {
      state.selectedAddress = action.payload.selectedAddress;
    },

    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddress = [];
    },
  },
});

export const { saveAddresses, saveSelectedAddress, clearAddresses } =
  userAddressSlice.actions;

export default userAddressSlice.reducer;
