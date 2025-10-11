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
        toast.err("ไม่สามารถโหลดข้อมูลรายวิชาได้");
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
      toast.err("คุณไม่มีสิทธิ์แก้ไขรายวิชา");
      return;
    }

    try {
      setLoading(true);
      await update(id, formData, token); // send token
      toast.success("แก้ไขรายวิชาเสร็จสิ้น");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.err("เกิดข้อผิดพลาดในการแก้ไขรายวิชา");
    } finally {
      setLoading(false);
    }
  };

  // Delete subject (admin only)
  const handleDelete = async () => {
    if (!isAdmin) {
      toast.err("คุณไม่มีสิทธิ์ลบรายวิชา");
      return;
    }

    try {
      setLoading(true);
      await remove(id, token); // send token
      toast.success("ลบรายวิชาเสร็จสิ้น");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.err("เกิดข้อผิดพลาดในการลบรายวิชา");
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
          <h1 className="text-xl font-semibold">
            แก้ไขรายวิชา 
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg mx-auto">
          {loading ? (
            <p className="text-center text-gray-600 text-lg">กำลังโหลด...</p>
          ) : (
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
                  className="flex-1 border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
                  disabled={!isAdmin}
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
                  className="flex-1 border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
                  disabled={!isAdmin}
                />
              </div>

              {/* ชื่อผู้สอน */}
              <div className="flex items-center space-x-2">
                <label className="text-black font-medium w-40">
                  ชื่อผู้สอน
                </label>
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  placeholder="กรอกชื่อผู้สอน"
                  className="flex-1 border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
                  disabled={!isAdmin}
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
                  disabled={!isAdmin}
                ></textarea>
              </div>

              {/* Buttons */}
              {isAdmin ? (
                <div className="flex justify-end space-x-4 pt-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-white text-black border border-gray-400 rounded-md text-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    ลบ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#1e2a47] text-white rounded-md text-lg hover:bg-[#162037] disabled:opacity-50"
                  >
                    {loading ? "กำลังบันทึก..." : "ยืนยัน"}
                  </button>
                </div>
              ) : (
                <p className="text-center text-red-600 font-medium pt-4">
                  🚫 คุณไม่มีสิทธิ์แก้ไขหรือลบรายวิชานี้
                </p>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditSubject;
