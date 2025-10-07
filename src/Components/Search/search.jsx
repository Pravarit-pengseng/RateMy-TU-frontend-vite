import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  searchCourses,
  saveSearchHistory,
  increasePopularity,
} from "../../Function/search";
import { MagnifyingGlassIcon , PlusCircleIcon} from "@heroicons/react/24/solid";


const Search = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTerm } = useSelector((state) => state.search);
  const role = useSelector((state) => state.user?.user?.role);

  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (location.pathname !== "/") {
      setShowDropdown(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(() => {
      fetchDataSearch(searchTerm);
    }, 100);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const fetchDataSearch = async (term) => {
    try {
      const res = await searchCourses(term);
      setSearchResults(res.data || []);
    } catch (err) {
      console.error("Search ERROR:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!searchTerm) return;
    const delay = setTimeout(async () => {
      try {
        await saveSearchHistory(searchTerm);
      } catch (err) {
        console.error("Search ERROR:", err?.response?.data || err.message);
      }
    }, 1500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleChange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { searchTerm: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate("/course?" + searchTerm);
      setShowDropdown(false);
    }
  };

  const handleFocus = () => setShowDropdown(true);
  const handleClickAway = () => setShowDropdown(false);

  const handleResultClick = async (subject) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { searchTerm: subject.name },
    });
    try {
      await increasePopularity(subject._id);
    } catch (err) {
      console.error("Search ERROR:", err?.response?.data || err.message);
    }
    if (onSearch) onSearch(subject);
    navigate(`/course/${subject.code || subject.courseCode}/${subject._id}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      dispatch({ type: "SEARCH_QUERY", payload: { searchTerm: "" } });
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [location.pathname, dispatch]);

  return (
    <div
      className="relative w-[450px]"
      ref={searchRef}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) handleClickAway();
      }}
    >
      {/* search input */}
      <form
        onSubmit={handleSubmit}
        className={`w-full h-[50px] border-[2.5px] border-white rounded-[25px] flex items-center px-[10px] bg-[#2d2f3b] transition relative z-[1000] ${
          showDropdown ? "rounded-b-[8px]" : ""
        }`}
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
        <input
          ref={inputRef}
          value={searchTerm || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Search..."
          type="text"
          className="w-full bg-transparent text-white placeholder-white/70 outline-none"
        />
        {role === "admin" && (
          <button
            type="button"
            className="text-white ml-2"
            onClick={() => navigate("/add-subject")}
            title="Add Subject"
          >
            <PlusCircleIcon className="h-6 w-6 text-gray-500" />
          </button>
        )}
      </form>

      {/* dropdown */}
      {showDropdown && (
        <div className="absolute top-[48px] left-0 right-0 max-h-[300px] overflow-y-auto z-[999] rounded-b-[16px] border-x-2 border-b-2 border-white bg-[#2d2f3b] text-white p-[2px]">
          {/* header */}
          {searchResults.length > 0 && (
            <div className="py-1 px-3 text-gray-400 text-xs">
              Search Results
            </div>
          )}

          {/* results */}
          {searchResults.map((subject) => (
            <button
              key={subject._id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleResultClick(subject)}
              className="w-full flex items-center gap-2 py-2 px-3 text-left hover:bg-white/10"
            >
              <span className="text-gray-400">↗</span>
              <span>
                {(subject.courseCode || subject.code) + " - " + subject.name}
              </span>
            </button>
          ))}

          {/* no result */}
          {searchTerm && searchResults.length === 0 && (
            <div className="py-3 px-3 text-center text-gray-400">
              No matches found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
