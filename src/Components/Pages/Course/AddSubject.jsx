import React, { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const AddSubject = () => {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [instructor, setInstructor] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[#2d2f3b] justify-center">
      <main className="flex-1 p-4 md:p-8 flex flex-col items-start">
        {/* Header */}
        <div className="flex items-center text-white space-x-2 mb-4">
          <ChevronLeftIcon className="h-6 w-6 cursor-pointer hover:text-gray-300" 
          strokeWidth={5} 
          />
          <h1 className="text-xl font-semibold">เพิ่มรายวิชา</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg mx-auto">
          <form className="space-y-4 text-lg">
            {/* รหัสวิชา */}
            <div className="flex items-center space-x-2">
              <label className="text-black font-medium">รหัสวิชา</label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="กรอกรหัสวิชา"
                className="border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* ชื่อวิชา */}
            <div className="flex items-center space-x-2">
              <label className="text-black font-medium">ชื่อวิชา</label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="กรอกชื่อวิชา"
                className="border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* ชื่อผู้สอน */}
            <div className="flex items-center space-x-2">
              <label className="text-black font-medium">ชื่อผู้สอน</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="กรอกชื่อผู้สอน"
                className="border-b border-gray-500 bg-transparent p-1 text-lg focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* รายละเอียดวิชา */}
            <div>
              <label className="block text-black font-medium mb-1 text-lg">
                รายละเอียดวิชา
              </label>
              <textarea
                placeholder="รายละเอียดวิชา...."
                className="w-full border border-gray-300 rounded-md p-3 text-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-white text-black border border-gray-400 rounded-md text-lg hover:bg-gray-100"
              >
                ลบ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1e2a47] text-white rounded-md text-lg hover:bg-[#162037]"
              >
                ยืนยัน
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddSubject;
