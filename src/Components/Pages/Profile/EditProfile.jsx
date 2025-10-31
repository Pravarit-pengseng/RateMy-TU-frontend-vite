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
// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfileImg } from "../../../Store/userSlice"; // import action
// ⭐️ 1. Import ไลบรารีที่ติดตั้ง
import imageCompression from "browser-image-compression";

export default function EditProfile() {
  // const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user.user);
  const [user, setUser] = useState(reduxUser || null);
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
    // ใช้โครงสร้าง Cloudinary object ที่ถูกต้อง
    profileImage: { url: "", publicId: null },
    visibilityGpa: true,
    visibilityFaculty: true,
    visibilityMajor: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  // ⭐️ (Optional) เพิ่ม state สำหรับ loading ตอนย่อรูป
  const [compressing, setCompressing] = useState(false);

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

  // ⭐️ 2. แก้ไข handleImageChange ให้มีการย่อขนาด
  const handleImageChange = async (e) => {
    // เปลี่ยนเป็น async
    const file = e.target.files[0];
    if (!file) return;

    // (Optional) แสดง loading
    setCompressing(true);
    setImagePreview(""); // เคลียร์ preview เก่า
    setImageFile(null); // เคลียร์ file เก่า

    console.log(`Original file size: ${file.size / 1024 / 1024} MB`);

    // --- ส่วนการย่อขนาด ---
    const options = {
      maxSizeMB: 1, // กำหนดขนาดสูงสุด (เช่น 1MB)
      maxWidthOrHeight: 1024, // กำหนดความกว้างหรือสูงสูงสุด (เช่น 1024px)
      useWebWorker: true, // ใช้ Web Worker เพื่อประสิทธิภาพ (แนะนำ)
      // คุณสามารถปรับ options อื่นๆ ได้ตามต้องการ ดูได้จากเอกสารของไลบรารี
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        `Compressed file size: ${compressedFile.size / 1024 / 1024} MB`
      );

      // ⭐️ ใช้ไฟล์ที่ถูกย่อแล้ว (compressedFile) ไปใส่ใน state
      setImageFile(compressedFile);

      // สร้าง Preview จากไฟล์ที่ย่อแล้ว
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      toast.error("ไม่สามารถย่อขนาดรูปภาพได้");
      // ถ้าการย่อล้มเหลว อาจจะใช้ไฟล์ต้นฉบับแทน (ถ้าต้องการ)
      // setImageFile(file);
      // const reader = new FileReader();
      // reader.onload = (event) => setImagePreview(event.target.result);
      // reader.readAsDataURL(file);
    } finally {
      setCompressing(false); // ซ่อน loading
    }
    // --- สิ้นสุดส่วนการย่อขนาด ---
  };

  // แก้ไข handleRemoveImage ให้รองรับ Cloudinary object
  const handleRemoveImage = async () => {
    try {
      const res = await removeProfileImage(profileData._id, user.token);
      const updatedUser = res.data; // รับข้อมูล user ที่อัปเดตแล้วกลับมา

      setImagePreview("");
      setImageFile(null);

      // อัปเดต state profileData ให้ profileImage เป็น Object ว่าง/default
      setProfileData({
        ...profileData, // ใช้ profileData เดิมสำหรับ field อื่นๆ
        profileImage: updatedUser.profileImage || { url: "", publicId: null }, // อัปเดตเฉพาะ profileImage
      });
      // อัปเดต Redux state ด้วย URL ว่าง
      dispatch(updateProfileImg(""));
      setTimeout(() => {
        window.location.reload();
      }, 2500);
      toast.success("ลบรูปภาพสำเร็จ");
    } catch (err) {
      console.error("Remove image error:", err);
      toast.error("ไม่สามารถลบรูปภาพได้");
    }
  };

  // แก้ไข handleSave ทั้งหมด (ไม่ต้องแก้ส่วนนี้แล้ว เพราะใช้ imageFile ที่ย่อแล้ว)
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", profileData.username || "");
      formData.append("bio", profileData.bio || "");
      formData.append("gpa", profileData.gpa || "");
      formData.append("faculty", profileData.faculty || "");
      formData.append("major", profileData.major || "");
      formData.append("visibilityGpa", profileData.visibilityGpa ?? true);
      formData.append(
        "visibilityFaculty",
        profileData.visibilityFaculty ?? true
      );
      formData.append("visibilityMajor", profileData.visibilityMajor ?? true);

      if (profileData.password) {
        formData.append("password", profileData.password);
      }

      // ⭐️ ส่วนนี้จะใช้ imageFile ที่ถูกย่อขนาดแล้วโดยอัตโนมัติ
      if (imageFile) {
        // 'profileImage' (มี 'e') ต้องตรงกับที่ multer ใน Backend ใช้
        formData.append("profileImage", imageFile);
      }

      // เรียก API updateProfile และ "รอ" (await) รับข้อมูลที่อัปเดตแล้วกลับมา
      const res = await updateProfile(profileData._id, formData, user.token);
      const updatedUser = res.data; // ข้อมูล user ใหม่ (ที่มี Cloudinary URL)
      console.log("UPDATED DATA: ", updatedUser);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      toast.success("บันทึกข้อมูลสำเร็จ");

      setImageFile(null); // เคลียร์ไฟล์ที่เลือกไว้

      // อัปเดต state หลัก (ข้อมูลโปรไฟล์) ทันทีจาก response
      setProfileData({
        ...updatedUser, // ใช้ข้อมูลใหม่ทั้งหมดจาก backend
        // ตรวจสอบให้แน่ใจว่า profileImage เป็น object ที่ถูกต้อง
        profileImage: updatedUser.profileImage || { url: "", publicId: null },
      });

      // อัปเดต Redux (รูปที่ Header) และ Image Preview ทันที
      if (updatedUser.profileImage && updatedUser.profileImage.url) {
        const newImageURL = updatedUser.profileImage.url;
        setImagePreview(newImageURL); // อัปเดต preview
        dispatch(updateProfileImg(newImageURL)); // อัปเดต Redux
      } else {
        // กรณีไม่มีรูป หรือลบรูป
        setImagePreview("");
        dispatch(updateProfileImg(""));
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

  // --- ส่วน JSX ไม่มีการเปลี่ยนแปลง ---
  // (คัดลอกส่วน return (...) จากโค้ดเดิมของคุณมาวางที่นี่)
  return (
    <div className="min-h-screen bg-[#2d3748] pb-12">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="bg-white rounded-[30px] p-10 shadow-2xl">
          <>
            {/* Edit mode */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div
                  className="w-[150px] h-[150px] rounded-full border-4 border-[#1E1E2F] overflow-hidden bg-[#e0e7ff] flex items-center justify-center cursor-pointer"
                  onClick={
                    () =>
                      !compressing &&
                      document.getElementById("avatarInput").click() // ⭐️ ป้องกันการคลิกตอนกำลังย่อ
                  }
                >
                  {compressing ? ( // ⭐️ แสดง loading ตอนย่อ
                    <div className="text-gray-500">Compressing...</div>
                  ) : imagePreview ? (
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
                  onClick={
                    () =>
                      !compressing &&
                      document.getElementById("avatarInput").click() // ⭐️ ป้องกันการคลิกตอนกำลังย่อ
                  }
                  className={`absolute bottom-2 right-2 bg-[#1E1E2F] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2d3748] ${
                    compressing ? "cursor-not-allowed opacity-50" : ""
                  }`} // ⭐️ ปิดปุ่มตอนย่อ
                  disabled={compressing} // ⭐️ ปิดปุ่มตอนย่อ
                >
                  <CameraIcon className="w-5 h-5" />
                </button>
                {imagePreview &&
                  !compressing && ( // ⭐️ ซ่อนปุ่มลบตอนย่อ
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
                  disabled={compressing} // ⭐️ ปิด input ตอนย่อ
                />
              </div>
              {compressing && (
                <p className="text-sm text-gray-500 mt-2">
                  กำลังย่อขนาดรูปภาพ...
                </p>
              )}
            </div>

            {/* ... (Edit Mode JSX inputs - เหมือนเดิม) ... */}
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
                  // ไม่ต้อง loadProfile() ตอนยกเลิก
                  // loadProfile(); // เอาออก
                }}
                className="bg-gray-400 text-white px-10 py-3 rounded-full text-lg font-medium hover:bg-gray-500 transition"
                disabled={compressing} // ⭐️ ปิดปุ่มตอนย่อ
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={`bg-[#2d3748] text-white px-10 py-3 rounded-full text-lg font-medium hover:shadow-lg transition ${
                  compressing ? "cursor-not-allowed opacity-50" : ""
                }`} // ⭐️ ปิดปุ่มตอนย่อ
                disabled={compressing} // ⭐️ ปิดปุ่มตอนย่อ
              >
                บันทึก
              </button>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
