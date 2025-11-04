import React from "react";
import { useSelector } from "react-redux";
import HeaderBar from "../Layout/HeaderBar";
import NotFound404 from "../Components/Pages/NotFound404";

const UserRoute = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  return user && user.user.token ? (
    <>
      <HeaderBar />
      {children}
    </>
  ) : (
    <NotFound404 text="You need to Login" Back="/login" />
  );
};

export default UserRoute;
