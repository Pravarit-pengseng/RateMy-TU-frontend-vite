import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getCurrentProfile,
  updateProfile,
  removeProfileImage,
} from "../../../Function/profile";
import { toast } from "react-toastify";
import {
  EyeIcon,
  EyeSlashIcon,
  CameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { updateProfileImg } from "../../../Store/userSlice"; // import action



export default function MyProfile() {
  const reduxUser = useSelector((state) => state.user.user);
  const [user, setUser] = useState(reduxUser || null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({
    _id: "",
    username: "",
    studentId: "",
    bio: "",
    gpa: "",
    faculty: "",
    major: "",
    password: "",
    profileImg: "",
    visibilityGpa: true,
    visibilityFaculty: true,
    visibilityMajor: true,
  });
  const [imageFile, setImageFile] = useState(null);
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

  // โหลด profile เมื่อ user พร้อม
  useEffect(() => {
    if (user?.token) loadProfile();
  }, [user]);

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
        password: "",
        profileImg: data.profileImg || "",
        visibilityGpa: data.visibilityGpa !== false,
        visibilityFaculty: data.visibilityFaculty !== false,
        visibilityMajor: data.visibilityMajor !== false,
      });
      if (data.profileImg) {
        // เพราะ profileImg ใน DB มี /uploads/xxx.jpg แล้ว
        setImagePreview(
          `${import.meta.env.VITE_APP_API.replace(/\/api$/, "")}${
            data.profileImg
          }`
        );
      } else {
        setImagePreview("");
      }
    } catch (err) {
      console.error("Load profile error:", err);
      toast.error("ไม่สามารถโหลดข้อมูลได้");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await removeProfileImage(profileData._id, user.token);
      setImagePreview("");
      setImageFile(null);
      setProfileData({ ...profileData, profileImg: "" });
      toast.success("ลบรูปภาพสำเร็จ");
    } catch (err) {
      console.error("Remove image error:", err);
      toast.error("ไม่สามารถลบรูปภาพได้");
    }
  };

  
const handleSave = async () => {
  try {
    const formData = new FormData();
    formData.append("username", profileData.username || "");
    formData.append("bio", profileData.bio || "");
    formData.append("gpa", profileData.gpa || "");
    formData.append("faculty", profileData.faculty || "");
    formData.append("major", profileData.major || "");
    formData.append("visibilityGpa", profileData.visibilityGpa ?? true);
    formData.append("visibilityFaculty", profileData.visibilityFaculty ?? true);
    formData.append("visibilityMajor", profileData.visibilityMajor ?? true);

    if (profileData.password)
      formData.append("password", profileData.password);

    if (imageFile) {
      formData.append("profileImg", imageFile);
    }

    await updateProfile(profileData._id, formData, user.token);
    toast.success("บันทึกข้อมูลสำเร็จ");

    setIsEditMode(false);
    setImageFile(null);

    // โหลดข้อมูลใหม่
    await loadProfile();

    // ✅ ถ้ามี Redux ใช้ dispatch เพื่ออัปเดตรูป HeaderBar ทันที
    if (profileData.profileImg) {
      const newImageURL = `${import.meta.env.VITE_APP_API.replace(
        /\/api$/,
        ""
      )}${profileData.profileImg}`;
      dispatch(updateProfileImg(newImageURL));
    }
  } catch (err) {
    console.error("Update error:", err);
    toast.error("ไม่สามารถบันทึกข้อมูลได้");
  }
};


  const toggleVisibility = (field) => {
    setProfileData({
      ...profileData,
      [`visibility${field.charAt(0).toUpperCase() + field.slice(1)}`]:
        !profileData[
          `visibility${field.charAt(0).toUpperCase() + field.slice(1)}`
        ],
    });
  };

  const faculties = [
    "วิศวกรรมศาสตร์",
    "วิทยาศาสตร์",
    "แพทยศาสตร์",
    "พยาบาลศาสตร์",
    "สถาปัตยกรรมศาสตร์",
    "ศิลปศาสตร์",
    "พาณิชยศาสตร์และการบัญชี",
    "นิติศาสตร์",
  ];

  const majors = [
    "วิศวกรรมคอมพิวเตอร์",
    "วิศวกรรมซอฟต์แวร์",
    "วิทยาการคอมพิวเตอร์",
    "เทคโนโลยีสารสนเทศ",
    "วิศวกรรมไฟฟ้า",
    "วิศวกรรมเครื่องกล",
    "วิศวกรรมโยธา",
  ];

  return (
    <div className="min-h-screen bg-[#2d3748] pb-12">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="bg-white rounded-[30px] p-10 shadow-2xl">
          {!isEditMode ? (
            <>
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
                {profileData.visibilityGpa && profileData.gpa && (
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

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-[#2d3748] text-white px-10 py-3 rounded-full text-lg font-medium hover:shadow-lg transition"
                >
                  แก้ไข
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Edit mode */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div
                    className="w-[150px] h-[150px] rounded-full border-4 border-[#1E1E2F] overflow-hidden bg-[#e0e7ff] flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                  >
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
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                    className="absolute bottom-2 right-2 bg-[#1E1E2F] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2d3748]"
                  >
                    <CameraIcon className="w-5 h-5" />
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                  <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-2 border-gray-200 rounded-2xl p-6 space-y-5">
                  <div>
                    <label className="font-semibold text-[#1E1E2F] block mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1E1E2F]"
                      placeholder="ชื่อผู้ใช้"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#1E1E2F] block mb-2">
                      รหัสนักศึกษา
                    </label>
                    <input
                      type="text"
                      value={profileData.studentId}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#1E1E2F]">
                        เกรดเฉลี่ย
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVisibility("gpa")}
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                          profileData.visibilityGpa
                            ? "bg-[#2d3748]"
                            : "bg-red-500"
                        }`}
                      >
                        {profileData.visibilityGpa ? "แสดง" : "ไม่แสดง"}
                      </button>
                    </label>
                    <input
                      type="text"
                      value={profileData.gpa}
                      onChange={(e) =>
                        setProfileData({ ...profileData, gpa: e.target.value })
                      }
                      maxLength="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1E1E2F]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#1E1E2F]">
                        คณะที่ศึกษา
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVisibility("faculty")}
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                          profileData.visibilityFaculty
                            ? "bg-[#2d3748]"
                            : "bg-red-500"
                        }`}
                      >
                        {profileData.visibilityFaculty ? "แสดง" : "ไม่แสดง"}
                      </button>
                    </label>
                    <select
                      value={profileData.faculty}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          faculty: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1E1E2F]"
                    >
                      <option value="">เลือกคณะ</option>
                      {faculties.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#1E1E2F]">
                        สาขาที่ศึกษา
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVisibility("major")}
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                          profileData.visibilityMajor
                            ? "bg-[#2d3748]"
                            : "bg-red-500"
                        }`}
                      >
                        {profileData.visibilityMajor ? "แสดง" : "ไม่แสดง"}
                      </button>
                    </label>
                    <select
                      value={profileData.major}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          major: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1E1E2F]"
                    >
                      <option value="">เลือกสาขา</option>
                      {majors.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-[#1E1E2F] block mb-2">
                      รหัสผ่าน
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={profileData.password}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            password: e.target.value,
                          })
                        }
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1E1E2F]"
                        placeholder="ใส่รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-3 text-[#2d3748]"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-6 h-6" />
                        ) : (
                          <EyeIcon className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-2xl p-6">
                  <label className="font-semibold text-[#1E1E2F] block mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="w-full h-[calc(100%-40px)] min-h-[400px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1E1E2F] resize-none"
                    placeholder="เขียนแนะนำตัวเอง..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    loadProfile();
                  }}
                  className="bg-gray-400 text-white px-10 py-3 rounded-full text-lg font-medium hover:bg-gray-500 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-[#2d3748] text-white px-10 py-3 rounded-full text-lg font-medium hover:shadow-lg transition"
                >
                  บันทึก
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}