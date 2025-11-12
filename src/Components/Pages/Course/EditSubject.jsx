import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { read, update, remove } from "../../../Function/subject";
import { toast } from "react-toastify";

const EditSubject = () => {
  const { id } = useParams(); // from route: /edit-course/:courseCode/:id
  const navigate = useNavigate();

  // ✅ Get user & token from Redux
  const user = useSelector((state) => state.user?.user);
  const token = user?.token;
  const isAdmin = user?.role === "admin";

  const [formData, setFormData] = useState({
    courseCode: "",
    name: "",
    teacher: "",
    detail: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Load subject details from backend
  useEffect(() => {
    const loadSubject = async () => {
      try {
        setLoading(true);
        const res = await read(id);
        const data = res.data;

        setFormData({
          courseCode: data.courseCode || "",
          name: data.name || "",
          teacher: data.teacher || "",
          detail: data.detail || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("ไม่สามารถโหลดข้อมูลรายวิชาได้");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadSubject();
  }, [id]);

  //  Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update subject (admin only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("คุณไม่มีสิทธิ์แก้ไขรายวิชา");
      return;
    }

    try {
      setLoading(true);
      await update(id, formData, token); // send token
      toast.success("แก้ไขรายวิชาเสร็จสิ้น");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขรายวิชา");
    } finally {
      setLoading(false);
    }
  };

  // Delete subject (admin only)
  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error("คุณไม่มีสิทธิ์ลบรายวิชา");
      return;
    }

    const confirmed = window.confirm("คุณแน่ใจหรือไม่ที่จะลบรายวิชานี้?");
    if (!confirmed) return;

    try {
      setLoading(true);
      await remove(id, token); // send token
      toast.success("ลบรายวิชาเสร็จสิ้น");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการลบรายวิชา");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-170.75 flex flex-col bg-[#2d2f3b] overflow-hidden font-kodchasan">
      <main className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center text-white space-x-2 mb-4">
          <ChevronLeftIcon
            className="h-6 w-6 cursor-pointer hover:text-gray-300"
            strokeWidth={5}
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl font-semibold">แก้ไขรายวิชา</h1>
        </div>

        {/* Form Card - Fixed Height */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-5xl flex-1 flex flex-col shadow-lg">
            {loading ? (
              <p className="text-center text-gray-600 text-lg">กำลังโหลด...</p>
            ) : (
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
                    className="flex-1 border-b-2 border-gray-400 bg-transparent p-2 text-lg focus:outline-none focus:border-indigo-600"
                    disabled={!isAdmin}
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
                    className="flex-1 border-b-2 border-gray-400 bg-transparent p-2 text-lg focus:outline-none focus:border-indigo-600"
                    disabled={!isAdmin}
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
                    className="flex-1 border-b-2 border-gray-400 bg-transparent p-2 text-lg focus:outline-none focus:border-indigo-600"
                    disabled={!isAdmin}
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
                    disabled={!isAdmin}
                  ></textarea>
                </div>

                {/* Buttons */}
                {isAdmin ? (
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-6 py-2.5 bg-white text-black border-2 border-gray-400 rounded-lg text-lg font-medium hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      ลบ
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#1e2a47] text-white rounded-lg text-lg font-medium hover:bg-[#162037] disabled:opacity-50 transition-colors"
                    >
                      {loading ? "กำลังบันทึก..." : "ยืนยัน"}
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-red-600 font-medium">
                    คุณไม่มีสิทธิ์แก้ไขหรือลบรายวิชานี้
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditSubject;