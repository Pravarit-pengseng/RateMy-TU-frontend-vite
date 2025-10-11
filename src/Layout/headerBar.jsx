import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Store/userSlice";

// icons
import {
  UserPlusIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";

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
  { title: "Profile", to: "/profile" },
  { title: "Logout", to: "/" },
];

function HeaderBar() {
  const { user } = useSelector((state) => state.user);
  const { username } = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlelogout = () => {
    setUserOpen(false);
    dispatch(logout());
    navigate(0);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-[64px]">
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
                  className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
                  onClick={() => setUserOpen((v) => !v)}
                >
                  <span className="sr-only">Open user menu</span>
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
