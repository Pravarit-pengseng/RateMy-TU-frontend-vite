import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//pages
import { currentAdmin } from "../Function/auth";
import NotFound404 from "../Components/Pages/NotFound404";

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token)
      currentAdmin(user.token)
        .then(() => setOk(true))
        .catch(() => setOk(false));
  }, [user]);

  const text = "NO PERMISSION!!";
  return ok ? (
    <div className="app">
      <main className="content">
        <div className="content_body">
          <div>{children}</div>
        </div>
      </main>
    </div>
  ) : (
    <NotFound404 text={text} Back="/" />
  );
};

export default AdminRoute;
