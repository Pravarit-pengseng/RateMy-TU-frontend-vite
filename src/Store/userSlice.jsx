import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [], // ข้อมูลผู้ใช้
  profileImg: "", // เพิ่มสำหรับเก็บรูปโปรไฟล์
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      // ถ้ามี profileImg จาก backend
      state.profileImg = action.payload.profileImg || "";
    },
    logout: (state) => {
      state.user = [];
      state.profileImg = "";
      localStorage.clear();
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    updateProfileImg: (state, action) => {
      if (state.user) {
        state.user.profileImg = action.payload;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, updateProfileImg, incrementByAmount } =
  userSlice.actions;

export default userSlice.reducer;
