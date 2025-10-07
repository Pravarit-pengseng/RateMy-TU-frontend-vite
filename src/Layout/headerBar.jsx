import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Store/userSlice";
import "@fontsource/pixelify-sans";

// icons
import {
  UserPlusIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";

const pages = [
  { title: "Home", to: "/" },
  { title: "Course", to: "/course" },
];

//  Added icons here
const authen = [
  { title: "Register", icon: <UserPlusIcon className="w-5 h-5" />, to: "/register" },
  { title: "Login", icon: <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />, to: "/login" },
];

const settings = [
  { title: "Profile", to: "/profile" },
  { title: "Logout", to: "/" },
];

function HeaderBar() {
  const { user } = useSelector((state) => ({ ...state }));
  const { username } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [userOpen, setUserOpen] = useState(false);

  const handlelogout = () => {
    setUserOpen(false);
    dispatch(logout());
    navigate("/");
    navigate(0);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-[64px]">
          {/* Left logo */}
          <button
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <img
              src="/assets/RateMyTULogo.jpeg"
              alt="logo"
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
            <span className="hidden md:flex text-black font-pixel text-[32px] font-[500]">
              RateMy TU
            </span>
          </button>

          {/* Pages (desktop) */}
          {/* <div className="hidden md:flex items-center gap-6">
            {pages.map((p, i) => (
              <Link key={i} to={p.to} className="text-black hover:opacity-70">
                {p.title}
              </Link>
            ))}
          </div> */}

          {/* Right side (auth / user) */}
          <div className="flex items-center gap-5">
            {pages.map((p, i) => {
              const active =
                location.pathname === p.to ||
                (p.to === "/course" && location.pathname.startsWith("/course"));
              return (
                <Link
                  key={i}
                  to={p.to}
                  className={`text-black ${active
                    ? "font-bold underline underline-offset-8 decoration-2"
                    : "hover:opacity-70"
                    }`}
                >
                  {p.title}
                </Link>
              );
            })}
            {user.user.length === 0 ? (
              <div className="hidden md:flex items-center gap-2">
                {authen.map((a, i) => (
                  <Link
                    key={i}
                    to={a.to}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-black/5 text-black transition"
                  >
                    {a.icon}
                    <span>{a.title}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center"
                  onClick={() => setUserOpen((v) => !v)}
                  aria-haspopup="menu"
                >
                  <span className="sr-only">Open user menu</span>
                </button>
                {userOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-md border"
                    onMouseLeave={() => setUserOpen(false)}
                  >
                    {/* {pages.map((p, i) => {
                      const active =
                        location.pathname === p.to ||
                        (p.to === "/course" && location.pathname.startsWith("/course"));
                      return (
                        <Link
                          key={i}
                          to={p.to}
                          className={`block px-3 py-2 hover:bg-black/5 ${active ? "font-bold underline underline-offset-4" : ""
                            }`}
                          onClick={() => setUserOpen(false)}
                        >
                          {p.title}
                        </Link>
                      );
                    })} */}
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
            {user.user.length !== 0 && (
              <span className="hidden sm:block">Hello, {username}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HeaderBar;
