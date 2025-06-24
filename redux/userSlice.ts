// import UserDetailsType from "@/types/UserDetailsType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  details: any;
  token?: string;
  userId?: number;
}

const initialState: UserState = {
  details: [],
  token: undefined,
  userId: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserDetails: (
      state,
      action: PayloadAction<{
        details: any;
        token: string;
        userId: number;
      }>
    ) => {
      const { details, token, userId } = action.payload;
      state.details = details;
      state.token = token;
      state.userId = userId;
    },
    clearUserDetails: (state) => {
      state.details = [];
      state.token = undefined;
      state.userId = undefined;
    },
  },
});

export const { saveUserDetails, clearUserDetails } = userSlice.actions;

export default userSlice.reducer;
