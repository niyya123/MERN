import { createSlice } from "@reduxjs/toolkit";
const initialState = {current: null, isFetching: false, error: false, isAdmin: false};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.isFetching = true;
    },
    signinSuccess: (state, action) => {     
      state.current = action.payload;
      state.isFetching = false;
      state.isAdmin = action.payload.isAdmin;    
    },
    signinFail: (state) => {
      state.error = true;
      state.isFetching = false;
    },
    signout: (state) => (state = initialState),
  },
});
export const { signinStart, signinSuccess, signinFail, signout } = userSlice.actions;
export default userSlice.reducer;
