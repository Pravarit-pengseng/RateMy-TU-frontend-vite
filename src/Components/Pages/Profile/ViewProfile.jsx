import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getCurrentProfile,
  getUserProfileByUsername,
} from "../../../Function/profile";
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
    console.log(
      "🔄 useEffect triggered. username =",
      username,
      "| user =",
      user
    );
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
    <div>
      <div className="min-h-screen bg-[#2d3748] pb-12">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="bg-white rounded-[30px] p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-10 mb-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-[150px] h-[150px] rounded-full border-4 border-[#1E1E2F] overflow-hidden bg-[#e0e7ff] flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
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
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-semibold text-[#1E1E2F] mb-3">
                  {profileData.username}
                </h2>
                <p className="text-gray-600 text-lg">
                  {profileData.bio || "Bio..."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {profileData.visibilityGpa && profileData.gpa !== 0 && (
                <div className="flex gap-5 py-4 border-b text-lg">
                  <span className="font-semibold text-[#1E1E2F] min-w-[180px]">
                    เกรดเฉลี่ย
                  </span>
                  <span className="text-gray-600">{profileData.gpa}</span>
                </div>
              )}
              {profileData.visibilityFaculty && profileData.faculty && (
                <div className="flex gap-5 py-4 border-b text-lg">
                  <span className="font-semibold text-[#1E1E2F] min-w-[180px]">
                    คณะที่ศึกษา
                  </span>
                  <span className="text-gray-600">{profileData.faculty}</span>
                </div>
              )}
              {profileData.visibilityMajor && profileData.major && (
                <div className="flex gap-5 py-4 border-b text-lg">
                  <span className="font-semibold text-[#1E1E2F] min-w-[180px]">
                    สาขาที่ศึกษา
                  </span>
                  <span className="text-gray-600">{profileData.major}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
