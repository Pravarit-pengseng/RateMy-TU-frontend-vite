import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [], // ข้อมูลผู้ใช้
  profileImage: "", // เพิ่มสำหรับเก็บรูปโปรไฟล์
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      // ถ้ามี profileImg จาก backend
      state.profileImage = action.payload.profileImage || "";
    },
    logout: (state) => {
      state.user = [];
      state.profileImage = "";
      localStorage.clear();
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    updateProfileImg: (state, action) => {
      if (state.user) {
        state.user.profileImage = action.payload;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, updateProfileImg, incrementByAmount } =
  userSlice.actions;

export default userSlice.reducer;
