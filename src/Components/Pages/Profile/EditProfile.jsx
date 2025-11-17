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
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { updateProfileImg } from "../../../Store/userSlice";
import imageCompression from "browser-image-compression";

export default function EditProfile() {
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
    profileImage: { url: "", publicId: null },
    visibilityGpa: true,
    visibilityFaculty: true,
    visibilityMajor: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [compressing, setCompressing] = useState(false);

  // Edit states for each field
  const [editingField, setEditingField] = useState({
    username: false,
    gpa: false,
    password: false,
  });

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

  useEffect(() => {
    if (user?.token) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const res = await getCurrentProfile(user.token);
      const data = res.data;

      console.log("Profile data loaded:", data);

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
      console.log("Profile loaded successfully, userId:", data._id);
    } catch (err) {
      console.error("Load profile error:", err);
      if (err.response?.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error("ไม่สามารถโหลดข้อมูลได้");
      }
    }
  };

  // Validate and format GPA (0.00 - 4.00)
  const handleGpaChange = (value) => {
    // Remove non-numeric characters except dot
    let cleanValue = value.replace(/[^\d.]/g, '');

    // Allow only one dot
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (parts[1]?.length > 2) {
      cleanValue = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // Convert to number for validation
    const numValue = parseFloat(cleanValue);

    // Validate range (0.00 - 4.00)
    if (cleanValue && !isNaN(numValue)) {
      if (numValue > 4.00) {
        toast.warning("เกรดเฉลี่ยต้องอยู่ระหว่าง 2.00 - 4.00");
        cleanValue = "4.00";
      } else if (numValue < 0) {
        cleanValue = "0.00";
      }
    }

    setProfileData({ ...profileData, gpa: cleanValue });
  };

  // Toggle edit mode for a field
  const toggleEditField = (field) => {
    setEditingField({
      ...editingField,
      [field]: !editingField[field],
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setCompressing(true);
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setImageFile(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
        toast.error("เกิดข้อผิดพลาดในการย่อขนาดรูป");
      } finally {
        setCompressing(false);
      }
    }
  };

  const handleRemoveImage = async () => {
    if (profileData.profileImage?.publicId) {
      try {
        // Use correct API signature: removeProfileImage(userId, authtoken)
        await removeProfileImage(profileData._id, user.token);
        setImagePreview("");
        setImageFile(null);
        setProfileData({
          ...profileData,
          profileImage: { url: "", publicId: null },
        });
        dispatch(updateProfileImg(""));
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        toast.success("ลบรูปภาพสำเร็จ");
      } catch (err) {
        console.error("Remove image error:", err);
        toast.error("ไม่สามารถลบรูปภาพได้");
      }
    } else {
      setImagePreview("");
      setImageFile(null);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Validate GPA before submit
      if (profileData.gpa) {
        const gpaNum = parseFloat(profileData.gpa);
        if (isNaN(gpaNum) || gpaNum < 2.00 || gpaNum > 4.00) {
          toast.warning("เกรดเฉลี่ยต้องอยู่ระหว่าง 2.00 - 4.00");
          return;
        }
      }

      // Validate required fields
      if (!profileData.username.trim()) {
        toast.warning("โปรดกรอกข้อมูลให้ครบถ้วน");
        return;
      }

      if (!profileData._id) {
        toast.error("ไม่พบข้อมูลผู้ใช้");
        return;
      }

      const formData = new FormData();
      formData.append("username", profileData.username);
      formData.append("bio", profileData.bio);
      formData.append("gpa", profileData.gpa);
      formData.append("faculty", profileData.faculty);
      formData.append("major", profileData.major);
      formData.append("visibilityGpa", profileData.visibilityGpa);
      formData.append("visibilityFaculty", profileData.visibilityFaculty);
      formData.append("visibilityMajor", profileData.visibilityMajor);

      if (profileData.password && profileData.password.trim()) {
        formData.append("password", profileData.password);
      }

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      console.log("Sending update request with userId:", profileData._id);

      // Use the correct API signature: updateProfile(userId, formData, authtoken)
      const res = await updateProfile(profileData._id, formData, user.token);
      console.log("Update response:", res);

      const updatedUser = res.data;

      toast.success("บันทึกข้อมูลสำเร็จ");
      setImageFile(null);

      setProfileData({
        ...updatedUser,
        password: "", // Clear password field after update
        profileImage: updatedUser.profileImage || { url: "", publicId: null },
      });

      // Reset editing states
      setEditingField({
        username: false,
        gpa: false,
        password: false,
      });

      if (updatedUser.profileImage && updatedUser.profileImage.url) {
        const newImageURL = updatedUser.profileImage.url;
        setImagePreview(newImageURL);
        dispatch(updateProfileImg(newImageURL));
      } else {
        setImagePreview("");
        dispatch(updateProfileImg(""));
      }

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        username: updatedUser.username,
        gpa: updatedUser.gpa,
        faculty: updatedUser.faculty,
        major: updatedUser.major,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
      }));

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, 2000);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("ไม่สามารถบันทึกข้อมูลได้");
      }
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
  ];

  const majors = [
    "วิศวกรรมซอฟต์แวร์",
  ];

  return (
    <div className="h-170.75 bg-[#3a3f4a] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-[30px] p-8 md:p-12 shadow-2xl relative">
          {/* Confirm button */}
          <button
            onClick={handleUpdateProfile}
            className="absolute bottom-13 right-16 px-7 py-1 border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors text-lg font-medium"
          >
            ยืนยัน
          </button>

          {/* Profile Image - Centered at top */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div
                className="w-[180px] h-[180px] rounded-full border-4 border-gray-300 overflow-hidden bg-[#e0e7ff] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() =>
                  !compressing && document.getElementById("avatarInput").click()
                }
              >
                {compressing ? (
                  <div className="text-gray-500 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-2"></div>
                    <p className="text-sm">กำลังโหลด...</p>
                  </div>
                ) : imagePreview ? (
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
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={compressing}
              />
              {imagePreview && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="ลบรูปภาพ"
                >
                  ×
                </button>
              )}
            </div>
            {/* <p className="text-sm text-gray-500 mt-2">คลิกเพื่อเปลี่ยนรูปโปรไฟล์</p> */}
          </div>

          {/* Main Content Area */}
          <div className="border-2 border-gray-300 rounded-[20px] p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side - Form Fields */}
              <div className="space-y-4">
                {/* Username */}
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                  <span className="text-xl text-gray-900 font-normal">Username</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({ ...profileData, username: e.target.value })
                      }
                      disabled={!editingField.username}
                      className={`text-xl text-right border-none focus:outline-none bg-transparent ${editingField.username ? 'border-b border-gray-400' : ''
                        }`}
                      placeholder="ชื่อผู้ใช้"
                    />
                    <button
                      onClick={() => toggleEditField('username')}
                      className={`text-gray-600 hover:text-gray-900 transition-colors ${editingField.username ? 'text-blue-600' : ''
                        }`}
                      title={editingField.username ? 'บันทึก' : 'แก้ไข'}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Student ID */}
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                  <span className="text-xl text-gray-900 font-normal">รหัสนักศึกษา</span>
                  <span className="text-xl text-gray-700">{profileData.studentId}</span>
                </div>

                {/* GPA */}
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                  <span className="text-xl text-gray-900 font-normal">เกรดเฉลี่ย</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profileData.gpa}
                      onChange={(e) => handleGpaChange(e.target.value)}
                      disabled={!editingField.gpa}
                      maxLength="4"
                      className={`w-24 text-xl text-right border-none focus:outline-none bg-transparent ${editingField.gpa ? 'border-b border-gray-400' : ''
                        }`}
                      placeholder="0.00"
                    />
                    <button
                      onClick={() => toggleVisibility("gpa")}
                      className={`px-4 py-1 rounded-full text-sm text-white transition-colors ${profileData.visibilityGpa ? "bg-[#2d3748]" : "bg-[#f8ad1f]"
                        }`}
                      title={profileData.visibilityGpa ? 'กำลังแสดง' : 'กำลังซ่อน'}
                    >
                      แสดง
                    </button>
                    <button
                      onClick={() => toggleEditField('gpa')}
                      className={`text-gray-600 hover:text-gray-900 transition-colors ${editingField.gpa ? 'text-blue-600' : ''
                        }`}
                      title={editingField.gpa ? 'บันทึก' : 'แก้ไข'}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Faculty */}
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                  <span className="text-xl text-gray-900 font-normal">คณะที่ศึกษา</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={profileData.faculty}
                      onChange={(e) =>
                        setProfileData({ ...profileData, faculty: e.target.value })
                      }
                      className="text-lg border-none focus:outline-none bg-transparent cursor-pointer hover:bg-gray-50 rounded px-2 py-1 text-center"
                    >
                      <option value="">เลือกคณะ</option>
                      {faculties.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => toggleVisibility("faculty")}
                      className={`px-4 py-1 rounded-full text-sm text-white transition-colors ${profileData.visibilityFaculty ? "bg-[#2d3748]" : "bg-[#f8ad1f]"
                        }`}
                      title={profileData.visibilityFaculty ? 'กำลังแสดง' : 'กำลังซ่อน'}
                    >
                      แสดง
                    </button>
                  </div>
                </div>

                {/* Major */}
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                  <span className="text-xl text-gray-900 font-normal">สาขาที่ศึกษา</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={profileData.major}
                      onChange={(e) =>
                        setProfileData({ ...profileData, major: e.target.value })
                      }
                      className="text-lg text-center border-none focus:outline-none bg-transparent cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
                    >
                      <option value="">เลือกสาขา</option>
                      {majors.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => toggleVisibility("major")}
                      className={`px-4 py-1 rounded-full text-sm text-white transition-colors ${profileData.visibilityMajor ? "bg-[#2d3748]" : "bg-[#f8ad1f]"
                        }`}
                      title={profileData.visibilityMajor ? 'กำลังแสดง' : 'กำลังซ่อน'}
                    >
                      แสดง
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                  <span className="text-xl text-gray-900 font-normal">รหัสผ่าน</span>
                  <div className="flex items-center gap-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={profileData.password}
                      onChange={(e) =>
                        setProfileData({ ...profileData, password: e.target.value })
                      }
                      disabled={!editingField.password}
                      className={`w-32 text-xl text-right border-none focus:outline-none bg-transparent ${editingField.password ? 'border-b border-gray-400' : ''
                        }`}
                      placeholder="XXXXXX"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleEditField('password')}
                      className={`text-gray-600 hover:text-gray-900 transition-colors ${editingField.password ? 'text-blue-600' : ''
                        }`}
                      title={editingField.password ? 'บันทึก' : 'แก้ไข'}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Bio */}
              <div>
                <h3 className="text-2xl font-normal text-gray-900 mb-4">Bio</h3>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  className="w-full h-64 border-2 border-gray-300 rounded-lg p-4 text-lg resize-none focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="เขียนบางอย่างเกี่ยวกับตัวคุณ..."
                  maxLength="500"
                />
                <p className="relative bottom-9 text-sm text-gray-500 mt-1 text-right pr-3">
                  {profileData.bio.length}/500
                </p>
              </div>
            </div>
          </div>

          {/* Info text
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>💡 คลิกไอคอนปากกาเพื่อแก้ไขข้อมูล</p>
            <p>📊 เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00 - 4.00</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}