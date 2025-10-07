import React from "react";
import { Link } from "react-router-dom";

export default function NotFound404({ text, Back }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full px-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 md:col-span-6">
            <h1 className="text-4xl font-bold">404 NOT FOUND</h1>
            <p className="text-lg mt-2">{text}</p>
            <Link to={Back || "/"}>
              <button className="mt-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Back Home
              </button>
            </Link>
          </div>
          <div className="col-span-12 md:col-span-6">
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt="notfound"
              width={500}
              height={250}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
