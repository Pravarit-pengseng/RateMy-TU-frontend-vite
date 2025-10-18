// import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { currentUser } from "./Function/auth";
import { useDispatch } from "react-redux";

//toastify alert
import { ToastContainer } from "react-toastify";

// pages
import FormSubject from "./Components/Pages/Course/FormSubject";
import Register from "./Components/Pages/Auth/Register";
import Login from "./Components/Pages/Auth/Login";

//admin
// import HomepageAdmin from "./components/pages/admin/HomepageAdmin";

//user
import HomepageUser from "./Components/Pages/User/HomepageUser";
import AdminRoute from "./Routes/adminRoute";
import UserRoute from "./Routes/userRoute";

//function
import { login } from "./Store/userSlice";
import NotFound404 from "./Components/Pages/NotFound404";

import EditSubject from "./Components/Pages/Course/EditSubject";
import AddSubject from "./Components/Pages/Course/AddSubject";
import HeaderBar from "./Layout/headerBar";
import MyProfile from "./Components/Pages/Profile/MyProfile";
import ReviewSub from "./Components/Pages/User/ReviewSub";

function App() {
  const dispatch = useDispatch();
  const idToken = localStorage.getItem("token");

  if (idToken) {
    currentUser(idToken)
      .then((res) => {
        dispatch(
          login({
            studentId: res.data.studentId,
            username: res.data.username,
            role: res.data.role,
            token: idToken,
          })
        );
      })
      .catch(() => {});
  }

  return (
    <BrowserRouter>
      <>
        <ToastContainer />
        <Routes>
          <Route
            path="*"
            element={
              <NotFound404
                text="The page you’re looking for doesn’t exist."
                Back="/"
              />
            }
          />
          <Route
            path="/"
            element={
              <>
                <HeaderBar />
                <HomepageUser />
              </>
            }
          />
          <Route
            path="/course/:courseCode/:id"
            element={
              <>
                <HeaderBar />
                <ReviewSub />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <HeaderBar />
                <MyProfile />
              </>
            }
          />
          <Route
            path="/course"
            element={
              <>
                <HeaderBar />
                <FormSubject />
              </>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* user */}
          <Route
            path="/user"
            element={<UserRoute>{/* <HomepageUser /> */}</UserRoute>}
          />

          {/* admin */}

          {/* edit Subject */}
          <Route
            path="/edit-course/:courseCode/:id"
            element={
              <AdminRoute>
                <HeaderBar />
                <EditSubject />
              </AdminRoute>
            }
          />

          {/* Add subject */}
          <Route
            path="/addsubject"
            element={
              <AdminRoute>
                <HeaderBar />
                <AddSubject />
              </AdminRoute>
            }
          />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
