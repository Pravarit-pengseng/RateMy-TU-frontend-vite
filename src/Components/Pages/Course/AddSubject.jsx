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
    <div className="min-h-screen flex flex-col bg-[#2d2f3b] justify-center">
      <main className="flex-1 p-4 md:p-8 flex flex-col items-start">
        {/* Header */}
        <div className="flex items-center text-white space-x-2 mb-4">
          <ChevronLeftIcon
            className="h-6 w-6 cursor-pointer hover:text-gray-300"
            strokeWidth={5}
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl font-semibold">เพิ่มรายวิชา</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg mx-auto">
          <form className="space-y-4 text-lg" onSubmit={handleSubmit}>
            {/* รหัสวิชา */}
            <div className="flex items-center space-x-2">
              <label className="text-black font-medium w-40">รหัสวิชา</label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="กรอกรหัสวิชา"
                required
                className="flex-1 border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* ชื่อวิชา */}
            <div className="flex items-center space-x-2">
              <label className="text-black font-medium w-40">ชื่อวิชา</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="กรอกชื่อวิชา"
                required
                className="flex-1 border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* ชื่อผู้สอน */}
            <div className="flex items-center space-x-2">
              <label className="text-black font-medium w-40">ชื่อผู้สอน</label>
              <input
                type="text"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                placeholder="กรอกชื่อผู้สอน"
                required
                className="flex-1 border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* รายละเอียดวิชา */}
            <div>
              <label className="block text-black font-medium mb-1 text-lg">
                รายละเอียดวิชา
              </label>
              <textarea
                name="detail"
                value={formData.detail}
                onChange={handleChange}
                placeholder="รายละเอียดวิชา...."
                className="w-full border border-gray-300 rounded-md p-3 text-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-white text-black border border-gray-400 rounded-md text-lg hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#1e2a47] text-white rounded-md text-lg hover:bg-[#162037] disabled:opacity-50"
              >
                {loading ? "กำลังบันทึก..." : "ยืนยัน"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddSubject;
