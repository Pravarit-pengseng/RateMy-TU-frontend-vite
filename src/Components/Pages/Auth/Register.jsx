import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../../../Function/auth";
import { toast } from "react-toastify";
import {
  UserIcon,
  IdentificationIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  HomeIcon
} from "@heroicons/react/24/outline";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const user = {
      studentId: data.get("studentId"),
      username: data.get("username"),
      password: data.get("password"),
    };

    if (!user.studentId || !user.username || !user.password) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }

    register(user)
      .then((res) => {
        toast.success(res.data);
        if (res.data === "เข้าสู่ระบบสำเร็จ") {
          navigate("/login");
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data || "ไม่สารมารถเข้าสู่ระบบได้");
      });
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#222831] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-[1050px] h-auto md:h-[650px] rounded-[15px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.2)] bg-[#31363F]">

        {/* image side */}
        <div className="hidden sm:flex flex-1 overflow-hidden rounded-t-[15px] md:rounded-t-none md:rounded-l-[15px] h-[250px] md:h-full w-full md:w-[500px]">
          <img
            src="./assets/Register.jpeg"
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>

        {/* form side */}
        <div className="flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-0 flex-1 w-full">
          <div className="text-white w-full flex items-center justify-between mb-6 text-[18px]">
            <span>Register</span>
            <button
              className="hover:opacity-80"
              onClick={() => navigate("/")}
              aria-label="Home"
              title="Home"
            >
              <HomeIcon className="h-6 w-6 text-[#ffffff]" />
            </button>
          </div>

          <img
            src="/assets/RateMyTULogo.jpeg"
            alt="logo"
            className="w-[100px] md:w-[120px] h-[100px] md:h-[120px] rounded-full object-cover"
          />

          <h1
            className="text-white justify-center items-center font-[500] text-[32px] md:text-[50px] mt-2 mb-6 md:mb-10 flex"
            style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
          >
            RateMy TU
          </h1>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="mt-4 w-full max-w-[400px]"
          >
            {/* studentId */}
            <div className="mb-3">
              <div className="relative">
                <IdentificationIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 w-6 h-6 text-[#4f4f4fff]" />
                <input
                  id="studentId"
                  name="studentId"
                  placeholder="Student ID"
                  autoComplete="studentId"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#959eafff] shadow-[0_4px_8px_#00000092] text-[#000000] placeholder-[#4f4f4fff] text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* username */}
            <div className="mb-3">
              <div className="relative">
                <UserIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 w-6 h-6 text-[#4f4f4fff]" />
                <input
                  id="username"
                  name="username"
                  placeholder="Username"
                  autoComplete="username"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#959eafff] shadow-[0_4px_8px_#00000092] text-[#000000] placeholder-[#4f4f4fff] text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* password */}
            <div className="mb-4">
              <div className="relative">
                <LockClosedIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 w-6 h-6 text-[#4f4f4fff]" />
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#959eafff] shadow-[0_4px_8px_#00000092] text-[#000000] placeholder-[#4f4f4fff] text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-90"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="toggle password"
                  title="toggle password"
                >
                  {showPassword ? (
                    <EyeIcon className="h-6 w-6 text-[#4f4f4fff]" />
                  ) : (
                    <EyeSlashIcon className="h-6 w-6 text-[#4f4f4fff]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 mb-3 py-3 rounded-lg text-white text-[1rem] md:text-[1.1rem] font-semibold"
              style={{
                background: "linear-gradient(45deg, #26268c 40%, #42a5f5 90%)",
              }}
            >
              Register
            </button>

            <div className="text-center">
              <span className="text-[#F5F5F5] text-sm md:text-base">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold"
                  style={{ color: "#f8ad1f" }}
                >
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
