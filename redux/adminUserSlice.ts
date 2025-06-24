// import UserDetailsType from "@/types/UserDetailsType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  adminDetails: any;
  adminToken?: string;
  adminUserId?: number;
}


const initialState: UserState = {
  adminDetails: [],
  adminToken: undefined,
  adminUserId: undefined,
};

export const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    saveUserAdminDetails: (
      state,
      action: PayloadAction<{
        adminDetails: any;
        adminToken: string;
        adminUserId: number;
      }>
    ) => {
      const { adminDetails, adminToken, adminUserId } = action.payload;
      state.adminDetails = adminDetails;
      state.adminToken = adminToken;
      state.adminUserId = adminUserId;
    },
    clearUserAdminDetails: (state) => {
      state.adminDetails = [];
      state.adminToken = undefined;
      state.adminUserId = undefined;
    },
  },
});

export const { saveUserAdminDetails, clearUserAdminDetails } =
  adminUserSlice.actions;

export default adminUserSlice.reducer;
