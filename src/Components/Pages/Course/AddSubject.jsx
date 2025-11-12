import React, { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { create } from "../../../Function/subject";

const AddSubject = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); // Redux user
  const [formData, setFormData] = useState({
    courseCode: "",
    name: "",
    teacher: "",
    detail: "",
  });
  const [loading, setLoading] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit new subject
  const handleSubmit = async (e) => {
    e.preventDefault();

    // check if user is admin
    if (!user || user.role !== "admin") {
      toast.error("คุณไม่มีสิทธิ์เพิ่มรายวิชา");
      return;
    }

    try {
      setLoading(true);
      const token = user.token;

      // use imported create function
      await create(formData, token);

      toast.success("เพิ่มรายวิชาเสร็จสิ้น");
      navigate("/"); // go back to admin subject list
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("ไม่ได้รับอนุญาต");
      } else {
        toast.error("เกิดข้อผิดพลาดในการเพิ่มรายวิชา");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ เพิ่ม font-kodchasan และคง h-screen / overflow-hidden เพื่อให้เป็นหน้าเดียว
    <div className="h-170.75 flex flex-col bg-[#2d2f3b] overflow-hidden font-kodchasan">
      <main className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center text-white space-x-2 mb-4">
          <ChevronLeftIcon
            className="h-6 w-6 cursor-pointer hover:text-gray-300"
            strokeWidth={5}
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl font-semibold">เพิ่มรายวิชา</h1>
        </div>

        {/* Form Card - Full Height */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-5xl flex-1 flex flex-col shadow-lg">
            <form className="flex flex-col h-full" onSubmit={handleSubmit}>
              {/* รหัสวิชา */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-black font-medium w-32 text-lg">รหัสวิชา</label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  placeholder="กรอกรหัสวิชา"
                  required
                  className="flex-1 border-b-2 border-gray-400 bg-transparent p-2 text-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* ชื่อวิชา */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-black font-medium w-32 text-lg">ชื่อวิชา</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="กรอกชื่อวิชา"
                  required
                  className="flex-1 border-b-2 border-gray-400 bg-transparent p-2 text-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* ชื่อผู้สอน */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-black font-medium w-32 text-lg">ชื่อผู้สอน</label>
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  placeholder="กรอกชื่อผู้สอน"
                  required
                  className="flex-1 border-b-2 border-gray-400 bg-transparent p-2 text-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* รายละเอียดวิชา */}
              <div className="flex-1 flex flex-col mb-4">
                <label className="block text-black font-medium mb-2 text-lg">
                  รายละเอียดวิชา
                </label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  placeholder="รายละเอียดวิชา...."
                  className="flex-1 w-full border-2 border-gray-300 rounded-lg p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 bg-white text-black border-2 border-gray-400 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#1e2a47] text-white rounded-lg text-lg font-medium hover:bg-[#162037] disabled:opacity-50 transition-colors"
                >
                  {loading ? "กำลังบันทึก..." : "ยืนยัน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddSubject;