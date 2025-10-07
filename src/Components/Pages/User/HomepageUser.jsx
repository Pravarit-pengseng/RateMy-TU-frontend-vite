import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Search from "../../Search/search";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getPopularSearches } from "../../../Function/search";

//icon
import { PencilSquareIcon } from "@heroicons/react/24/outline";
function HomepageUser() {
  const API = import.meta.env.REACT_APP_API;
  const role = useSelector((state) => state.user?.user?.role);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await getPopularSearches();
        const data = res.data?.subjects || res.data || [];
        // console.log("DATA : ",res.data)
        setSubjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load subjects:", err);
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className="bg-[#2d2f3b] min-h-screen w-full overflow-x-hidden">
      <div className="w-full">
        {/* Hero */}
        <div className=" ">
          <div className="bg-[url('/assets/home-bg.png')] bg-no-repeat bg-center bg-cover w-full h-[calc(100vh-150px)] flex flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-white font-bold mt-1 sm:mt-8 mb-1 sm:mb-8 text-[32px] sm:text-[48px] md:text-[64px] lg:text-[80px]">
                Find your <ins>FAVORITE </ins> subject
              </h1>
              <p className="text-white mb-3 sm:mb-5 px-2 sm:px-10">
                Explore friends review, rating and professor to make informed
                academic choice
              </p>
            </div>
            <div className="flex justify-center mb-4 sm:mb-8">
              <Search />
            </div>
          </div>
        </div>

        {/* Top 5 */}
        <div className="px-3 sm:px-6">
          <hr className="h-[5px] bg-white border-0" />
          <h2 className="mb-3 font-bold text-white text-left ml-1 mt-5">
            TOP 5 Searched Subject
          </h2>

          {loading ? (
            <p className="text-white text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <div className="grid grid-cols-10 gap-5 ">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="col-span-12 sm:col-span-6 md:col-span-4 lg:[grid-column:span_2_/_span_2]"
                >
                  <div
                    className="p-4 rounded-2xl h-full transition relative bg-white hover:bg-[#f9f9f9] hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                    onClick={() =>
                      navigate(`/course/${subject.courseCode}/${subject._id}`)
                    }
                  >
                    {/* edit icon for admin */}
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
                        <PencilSquareIcon className="h-6 w-6 text-gray-500" />
                      </button>
                    )}
                    <div className="space-y-1  ">
                      <div className="text-sm text-gray-600">
                        Code: {subject.courseCode}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        Name :{subject.name}
                      </div>
                      <div className="text-sm">
                        Teacher: <b>{subject.teacher}</b>
                      </div>
                      <div className="text-sm">{subject.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="h-32" />
        </div>
      </div>
    </div>
  );
}

export default HomepageUser;
