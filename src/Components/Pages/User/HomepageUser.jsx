import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Search from "../../Search/search";
import { useNavigate } from "react-router-dom";
import { getPopularSearches } from "../../../Function/search";
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
      <div className="w-full  ">
        {/* Hero */}
        <div>
          <div className="bg-[url('/assets/home-bg.png')] bg-no-repeat bg-center bg-cover w-full md:h-[calc(100vh-150px)] flex flex-col items-center justify-center px-5 sm:px-10 sm: h-[calc(50vh-10px)] ">
            <div className="text-center">
              <h1 className="text-white font-bold mt-1 sm:mt-8 mb-1 sm:mb-4  text-[28px] sm:text-[48px] md:text-[64px] lg:text-[80px] leading-snug">
                Find your <ins>FAVORITE</ins> subject
              </h1>
              <p className="text-white  mb-5 sm:mb-3 text-sm sm:text-base">
                Explore friends’ reviews, ratings, and professors to make
                informed academic choices
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-center mt-5 mb-4 sm:mb-8 ">
              <Search />
            </div>
          </div>
        </div>

        {/* Top 5 */}
        <div className="px-3 sm:px-6">
          <hr className="h-[5px] bg-white border-0" />
          <h2 className="mb-3 font-bold text-2xl text-white text-left ml-1 mt-5">
            TOP 5 Searched Subject
          </h2>

          {loading ? (
            <p className="text-white text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {subjects.map((subject, index) => (
                <div key={index} className="col-span-1">
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
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">
                        {subject.courseCode}
                      </div>
                      <div className="text-lg font-bold text-[#26268C]">
                        {subject.name}
                      </div>

                      <div className="text-sm">{subject.detail}</div>
                      <div className="text-sm">
                        <b>{subject.teacher}</b>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}

export default HomepageUser;
