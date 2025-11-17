import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCurrentProfile, getUserProfileByUsername } from "../../../Function/profile";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_APP_API;

export default function ViewProfile() {
  const { username } = useParams();
  const reduxUser = useSelector((state) => state.user.user);
  const [user, setUser] = useState(reduxUser || null);
  const [profileData, setProfileData] = useState({
    _id: "",
    username: "",
    studentId: "",
    bio: "",
    gpa: "",
    faculty: "",
    major: "",
    password: "",
    profileImage: { url: "", publicId: null },
    visibilityGpa: true,
    visibilityFaculty: true,
    visibilityMajor: true,
  });
  const [imagePreview, setImagePreview] = useState("");

  // โหลด user จาก localStorage หาก Redux state ไม่มี
  useEffect(() => {
    if (!reduxUser) {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        setUser({ ...JSON.parse(storedUser), token: storedToken });
      }
    } else {
      setUser(reduxUser);
    }
  }, [reduxUser]);

  // โหลด profile
  useEffect(() => {
    console.log("📄 useEffect triggered. username =", username, "| user =", user);
    if (username) {
      console.log("📡 Loading profile by username:", username);
      loadProfile(username);
    } else if (user?.token) {
      console.log("📡 Loading current user profile");
      loadProfile();
    }
  }, [username, user]);

  // โหลดโปรไฟล์ตาม username (หรือของตัวเอง)
  const loadProfile = async (targetUsername) => {
    try {
      let data;

      if (targetUsername) {
        const res = await getUserProfileByUsername(targetUsername);
        data = res.data;
        console.log("✅ Profile data (by username) loaded:", data);
      } else {
        const res = await getCurrentProfile(user.token);
        data = res.data;
        console.log("✅ Profile data (current user) loaded:", data);
      }

      // ตรวจชนิดของ profileImage (อาจเป็น string หรือ object)
      let profileImageData = { url: "", publicId: null };
      if (typeof data.profileImage === "string") {
        profileImageData.url = data.profileImage;
      } else if (data.profileImage && data.profileImage.url) {
        profileImageData = data.profileImage;
      }

      setProfileData({
        _id: data._id || "",
        username: data.username || "",
        studentId: data.studentId || "",
        bio: data.bio || "",
        gpa: data.gpa || "",
        faculty: data.faculty || "",
        major: data.major || "",
        password: "",
        profileImage: profileImageData,
        visibilityGpa: data.visibilityGpa ?? true,
        visibilityFaculty: data.visibilityFaculty ?? true,
        visibilityMajor: data.visibilityMajor ?? true,
      });

      const imageUrl = profileImageData.url || "";
      setImagePreview(imageUrl);
      console.log("🖼️ Profile image:", imageUrl || "(no image)");
      console.log("🎯 Final profileData state to set:", {
        username: data.username,
        faculty: data.faculty,
        major: data.major,
        gpa: data.gpa,
      });
    } catch (err) {
      console.error("❌ Load profile error:", err);
      toast.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  return (
    <div className="h-170.75 bg-[#3a3f4a] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-[30px] p-8 md:p-12 shadow-2xl relative">
          {/* Close button */}
          <button
            onClick={() => window.history.back()}
            className="absolute bottom-1 right-12 px-7 py-1 border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors text-lg font-medium"
          >
            ปิด
          </button>

          {/* Profile Image and Username - Centered at top */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-[180px] h-[180px] rounded-full border-4 border-gray-300 overflow-hidden bg-[#e0e7ff] flex items-center justify-center mb-6">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400 p-1">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              )}
            </div>
            <h2 className="text-4xl font-medium text-gray-900">
              {profileData.username || "Username"}
            </h2>
          </div>

          {/* Main Content Area - Bio on left, Info on right */}
          <div className="border-2 border-gray-300 rounded-[20px] p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side - Bio */}
              <div>
                <h3 className="text-2xl font-normal text-gray-900 mb-4">Bio</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 min-h-[150px] bg-gray-50">
                  <p className="text-gray-700 text-lg whitespace-pre-wrap">
                    {profileData.bio || "..."}
                  </p>
                </div>
              </div>

              {/* Right Side - Info */}
              <div className="space-y-6">
                {/* GPA */}
                {profileData.visibilityGpa && profileData.gpa !== 0 && (
                  <div className="border-b-2 border-gray-300 pb-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-normal text-gray-900">เกรดเฉลี่ย</span>
                      <span className="text-2xl text-gray-700">{profileData.gpa || "3.33"}</span>
                    </div>
                  </div>
                )}

                {/* Faculty */}
                {profileData.visibilityFaculty && profileData.faculty && (
                  <div className="border-b-2 border-gray-300 pb-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-normal text-gray-900">คณะที่เรียน</span>
                      <span className="text-2xl text-gray-700">{profileData.faculty || "คณะวิศวะ"}</span>
                    </div>
                  </div>
                )}

                {/* Major */}
                {profileData.visibilityMajor && profileData.major && (
                  <div className="border-b-2 border-gray-300 pb-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-normal text-gray-900">สาขาที่เรียน</span>
                      <span className="text-2xl text-gray-700">{profileData.major || "สาขาซอฟฟ"}</span>
                    </div>
                  </div>
                )}

                {/* If all fields are hidden, show a message */}
                {!profileData.visibilityGpa && !profileData.visibilityFaculty && !profileData.visibilityMajor && (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-xl">ผู้ใช้เลือกไม่แสดงข้อมูลส่วนตัว</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}