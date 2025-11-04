import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Store/userSlice";
import { getCurrentProfile } from "../Function/profile";

// icons
import {
  UserPlusIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";

function HeaderBar() {
  const { user } = useSelector((state) => state.user);
  const { username } = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pages = [
    { title: "Home", to: "/" },
    { title: "Course", to: "/course" },
  ];

  const authen = [
    {
      title: "Register",
      icon: <UserPlusIcon className="w-5 h-5" />,
      to: "/register",
    },
    {
      title: "Login",
      icon: <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />,
      to: "/login",
    },
  ];
  const settings = [
    { title: "Profile", to: `/EditProfile/${user.username}` },
    { title: "Logout", to: "/" },
  ];

  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "",
    profileImage: "",
  });
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.token) {
        try {
          const res = await getCurrentProfile(user.token);
          const data = res.data;
          setUserProfile({
            username: data.username || "",
            profileImage: data.profileImage ? data.profileImage.url : "",
          });
        } catch (err) {
          console.error("Load user profile error:", err);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handlelogout = () => {
    setUserOpen(false);
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/5">
      <div className="max-w-[14500px] mx-5 ">
        <div className="flex items-center justify-between h-[58px]">
          {/* Logo */}
          <button
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <img
              src="/assets/RateMyTULogo.jpeg"
              alt="logo"
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
            <span
              className="hidden md:flex text-black text-[32px] font-[500]"
              style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
            >
              RateMy TU
            </span>
          </button>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-5">
            {pages.map((p, i) => {
              const active =
                location.pathname === p.to ||
                (p.to === "/course" && location.pathname.startsWith("/course"));
              return (
                <Link
                  key={i}
                  to={p.to}
                  className={`text-black ${
                    active
                      ? "font-bold underline underline-offset-8 decoration-2"
                      : "hover:opacity-70"
                  }`}
                >
                  {p.title}
                </Link>
              );
            })}

            {/* Auth or user */}
            {user.length === 0 ? (
              authen.map((a, i) => (
                <Link
                  key={i}
                  to={a.to}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-black/5 text-black transition"
                >
                  {a.icon}
                  <span>{a.title}</span>
                </Link>
              ))
            ) : (
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                  onClick={() => setUserOpen((v) => !v)}
                >
                  <span className="sr-only">Open user menu</span>
                  {userProfile.profileImage ? (
                    <img
                      src={userProfile.profileImage}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full text-gray-400 p-1"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  )}
                </button>

                {userOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-md border"
                    onMouseLeave={() => setUserOpen(false)}
                  >
                    {settings.map((s, i) =>
                      s.title === "Logout" ? (
                        <button
                          key={i}
                          onClick={handlelogout}
                          className="w-full text-left px-3 py-2 hover:bg-black/5"
                        >
                          {s.title}
                        </button>
                      ) : (
                        <Link
                          key={i}
                          to={s.to}
                          className="block px-3 py-2 hover:bg-black/5"
                          onClick={() => setUserOpen(false)}
                        >
                          {s.title}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
            {user.length !== 0 && (
              <span className="hidden sm:block ml-2">Hello, {username}</span>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md bg-black/5"
            >
              <span className="sr-only">Open menu</span>
              <div className="w-6 h-0.5 bg-black mb-1"></div>
              <div className="w-6 h-0.5 bg-black mb-1"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col p-4 gap-2">
            {pages.map((p, i) => (
              <Link
                key={i}
                to={p.to}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 hover:bg-black/5 rounded"
              >
                {p.title}
              </Link>
            ))}

            {user.length === 0
              ? authen.map((a, i) => (
                  <Link
                    key={i}
                    to={a.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 rounded"
                  >
                    {a.icon}
                    <span>{a.title}</span>
                  </Link>
                ))
              : settings.map((s, i) =>
                  s.title === "Logout" ? (
                    <button
                      key={i}
                      onClick={() => {
                        handlelogout();
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-black/5 rounded"
                    >
                      {s.title}
                    </button>
                  ) : (
                    <Link
                      key={i}
                      to={s.to}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 hover:bg-black/5 rounded"
                    >
                      {s.title}
                    </Link>
                  )
                )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default HeaderBar;
