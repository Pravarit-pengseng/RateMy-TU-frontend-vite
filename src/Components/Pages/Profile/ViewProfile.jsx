import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCurrentProfile } from "../../../Function/profile";
import { toast } from "react-toastify";


export default function ViewProfile() {
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

  // โหลด user จาก localStorage หาก Redux state ไม่มี (ส่วนนี้ OK)
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

  // โหลด profile เมื่อ user พร้อม (ส่วนนี้ OK)
  useEffect(() => {
    if (user?.token) loadProfile();
  }, [user]);

  // แก้ไข loadProfile ให้รองรับ Cloudinary object
  const loadProfile = async () => {
    try {
      const res = await getCurrentProfile(user.token);
      const data = res.data;
      setProfileData({
        _id: data._id,
        username: data.username || "",
        studentId: data.studentId || "",
        bio: data.bio || "",
        gpa: data.gpa || "",
        faculty: data.faculty || "",
        major: data.major || "",
        password: "", // ไม่โหลด password กลับมา
        // ดึงข้อมูลรูปภาพจาก profileImage object ใน Backend
        profileImage: data.profileImage || { url: "", publicId: null },
        visibilityGpa: data.visibilityGpa ?? true,
        visibilityFaculty: data.visibilityFaculty ?? true,
        visibilityMajor: data.visibilityMajor ?? true,
      });

      // ใช้ profileImage.url สำหรับแสดงรูป
      if (data.profileImage && data.profileImage.url) {
        setImagePreview(data.profileImage.url);
      } else {
        setImagePreview("");
      }
    } catch (err) {
      console.error("Load profile error:", err);
      toast.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-[#2d3748] pb-12">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="bg-white rounded-[30px] p-10 shadow-2xl">
            {/* ... (View Mode JSX - เหมือนเดิม) ... */}
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
                    <span className="text-6xl">👤</span>
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
              {profileData.visibilityGpa &&
                profileData.gpa !== 0 && ( // ⭐️ แก้ไข: เพิ่มเงื่อนไข gpa !== 0
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

           <br/>  
          </div>
        </div>
      </div>
    </div>
  );
}
