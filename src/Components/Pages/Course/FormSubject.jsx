import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// files import
import Search from "../../Search/search";
import { searchCourses } from "../../../Function/search";
import { getdata } from "../../../Function/subject";

//icon
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const FormSubject = () => {
  const role = useSelector((state) => state.user?.user?.role);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSelector((state) => state.search);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getdata();
      // console.log("Data from API:", res.data);
      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("ERROR : ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      loadData();
      return;
    }
    const delay = setTimeout(() => {
      fetchDataSearch(searchTerm);
    }, 200);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const fetchDataSearch = async (term) => {
    try {
      const res = await searchCourses(term);
      console.log("Search result:", res.data);
      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Axios ERROR:", err?.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-6 text-white">
        <div className="mx-auto w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin" />
        <p className="mt-2">Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2d2f3b] h-screen w-screen overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex justify-center my-3">
          <Search />
        </div>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-12 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="col-span-12 sm:col-span-6 md:col-span-3"
              >
                <div
                  className="h-full rounded-2xl shadow-md relative bg-white hover:bg-[#F2F2F2] hover:shadow-xl transition cursor-pointer"
                  onClick={() =>
                    navigate(`/course/${subject.courseCode}/${subject._id}`)
                  }
                >
                  {role === "admin" && (
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 hover:bg-black/5 rounded-md p-1"
                      title="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/edit-course/${subject.courseCode}/${subject._id}`
                        );
                      }}
                    >
                      <PencilSquareIcon className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                    </button>
                  )}
                  <div className="p-4">
                    <div className="text-sm text-gray-600">
                      Code: {subject.courseCode}
                    </div>
                    <div className="text-lg text-blue-600 font-semibold">
                      Name: {subject.name}
                    </div>
                    <div className="text-sm mt-1">
                      Teacher: <b>{subject.teacher}</b>
                    </div>
                    <div className="text-sm mt-1">{subject.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="m-[3vh] text-white flex items-center justify-center text-center">
            No subjects available.
          </p>
        )}

        <div className="h-32" />
      </div>
    </div>
  );
};

export default FormSubject;
