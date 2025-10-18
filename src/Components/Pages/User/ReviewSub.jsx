// ReviewSub.jsx
import React, { useState } from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PaperAirplaneIcon,
  PencilIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  HeartIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";

function ReviewSub() {
  const [isOpen, setIsOpen] = useState(true);
  const [openId, setOpenId] = useState(null); //  เก็บ ID ของโพสต์ที่เปิดอยู่
  const [activeTab, setActiveTab] = useState("review");
  // const [userReaction, setUserReaction] = useState(null); // 'like' หรือ 'dislike'

  const handleLike = (reviewId) => {
    setReactions((prev) => {
      const current = prev[reviewId];
      const isLiked = current.userReaction === "like";

      return {
        ...prev,
        [reviewId]: {
          ...current,
          likes: current.likes + (isLiked ? -1 : 1),
          dislikes:
            current.userReaction === "dislike"
              ? current.dislikes - 1
              : current.dislikes,
          userReaction: isLiked ? null : "like",
        },
      };
    });
  };

  const handleDislike = (reviewId) => {
    setReactions((prev) => {
      const current = prev[reviewId];
      const isDisliked = current.userReaction === "dislike";

      return {
        ...prev,
        [reviewId]: {
          ...current,
          dislikes: current.dislikes + (isDisliked ? -1 : 1),
          likes:
            current.userReaction === "like" ? current.likes - 1 : current.likes,
          userReaction: isDisliked ? null : "dislike",
        },
      };
    });
  };
  const [reviews, setReviews] = useState([
    {
      id: 1,
      username: "user123",
      postDate: "2024-01-15",
      courseName: "Computer Science 101",
      professorName: "Dr. Smith",
      comment: "วิชานี้เนื้อหาดีมาก แต่ค่อนข้างยาก",
      sec: "760001", //เซค
      term: "1", //ภาคเรียน
      year: "2567", //ปีการศึกษา
      grade: "B+",
      likes: 0,
      dislikes: 0,
      ratings: {
        homework: 4,
        interest: 3,
        teaching: 5,
        rating: 3, //คะแนนรีวิว
      },
      replies: [
        {
          username: "student456",
          comment: "ตรงกับที่ผมคิดเลย",
          date: "2024-01-16",
        },
      ],
    },
    {
      id: 2,
      username: "study_king",
      postDate: "2024-01-10",
      courseName: "Mathematics 202",
      professorName: "Dr. Johnson",
      comment: "อาจารย์สอนเข้าใจง่าย งานบ้านพอเหมาะ",
      sec: "760001", //เซค
      term: "1", //ภาคเรียน
      year: "2568", //ปีการศึกษา
      grade: "A",
      ratings: {
        homework: 5,
        interest: 4,
        teaching: 5,
        rating: 5, //คะแนนรีวิว
      },
      replies: [],
    },
  ]);
  // const [likes, setLikes] = useState(reviews.likes || 0);
  // const [dislikes, setDislikes] = useState(reviews.dislikes || 0);
  const [reactions, setReactions] = useState(() =>
    reviews.reduce((acc, review) => {
      acc[review.id] = {
        likes: review.likes || 0,
        dislikes: review.dislikes || 0,
        userReaction: null,
      };
      return acc;
    }, {})
  );
  const [questions, setQuestions] = useState([
    {
      id: 1,
      username: "curious_student",
      question: "วิชานี้ติด A เท่าไรคะ",
      replies: [
        {
          username: "senior_student",
          answer: "ประมาณ 30% ของชั้นเรียนได้ A ครับ",
          date: "2024-01-12",
        },
      ],
    },
    {
      id: 2,
      username: "new_student",
      question: "สอบยากไหมครับ",
      replies: [],
    },
  ]);

  const [newReview, setNewReview] = useState({
    homework: 0,
    interest: 0,
    teaching: 0,
    comment: "",
    sec: "", //เซค
    term: "", //ภาคเรียน
    year: "", //ปีการศึกษา
    grade: "",
    rating: 0, //คะแนนรีวิว
  });

  const [newQuestion, setNewQuestion] = useState("");
  const [replyContents, setReplyContents] = useState({});

  const handleRatingChange = (category, value) => {
    setNewReview((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      username: "current_user",
      postDate: new Date().toISOString().split("T")[0],
      courseName: "Current Course",
      professorName: "Current Professor",
      comment: newReview.comment,
      sec: newReview.sec,
      term: newReview.term,
      year: newReview.year,
      grade: newReview.grade,
      ratings: {
        homework: newReview.homework,
        interest: newReview.interest,
        teaching: newReview.teaching,
        rating: newReview.rating,
      },
      replies: [],
    };

    setReviews([review, ...reviews]);
    setNewReview({
      homework: 0,
      interest: 0,
      teaching: 0,
      comment: "",
      sec: "", //เซค
      term: "", //ภาคเรียน
      year: "", //ปีการศึกษา
      grade: "",
      rating: 0, //คะแนนรีวิว
    });
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    const question = {
      id: questions.length + 1,
      username: "current_user",
      question: newQuestion,
      replies: [],
    };

    setQuestions([question, ...questions]);
    setNewQuestion("");
  };

  const handleReply = (type, id, content) => {
    if (type === "review") {
      setReviews(
        reviews.map((review) => {
          if (review.id === id) {
            return {
              ...review,
              replies: [
                ...review.replies,
                {
                  username: "current_user",
                  comment: content,
                  date: new Date().toISOString().split("T")[0],
                },
              ],
            };
          }
          return review;
        })
      );
    } else {
      setQuestions(
        questions.map((question) => {
          if (question.id === id) {
            return {
              ...question,
              replies: [
                ...question.replies,
                {
                  username: "current_user",
                  answer: content,
                  date: new Date().toISOString().split("T")[0],
                },
              ],
            };
          }
          return question;
        })
      );
    }
    setReplyContents((prev) => ({ ...prev, [`${type}_${id}`]: "" }));
  };

  const RatingStars = ({ rating, onRatingChange, readOnly = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onRatingChange(star)}
            disabled={readOnly}
            className={`${
              readOnly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 transition-transform"
            } ${star <= rating ? "text-yellow-400" : "text-gray-300"} text-xl`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };
  //  web css part
  return (
    <div className="">
      <div className="flex min-h-screen bg-gray-100 ">
        {/* Sidebar */}
        <div
          className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 
        ${isOpen ? "w-lg " : "w-14"} flex flex-col `}
        >
          {/* Toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 hover:bg-gray-100 flex items-center justify-end"
          >
            {isOpen ? (
              <ChevronDoubleLeftIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <ChevronDoubleRightIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Content in sidebar */}
          {isOpen && (
            <div className="p-4 overflow-y-auto w-lg">
              <header className="text-center mb-8">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold">
                    ชื่อวิชาและชื่ออาจารย์
                  </h2>
                  <p className="text-gray-600">รายละเอียดของวิชานี้...</p>
                  <div className="mt-2">
                    <span className="text-lg font-medium">คะแนนเฉลี่ย 4/5</span>
                    <span className="text-gray-500 ml-4">
                      จำนวนรีวิว: {reviews.length}
                    </span>
                  </div>
                </div>
              </header>
              {/* Posting review Form */}
              <section className="mb-8 bg-blue-50 p-6 rounded-lg transition-all duration-300">
                {/* === Tabs === */}
                <div className="flex  mb-6">
                  <p
                    onClick={() => setActiveTab("review")}
                    className={` py-2  font-semibold transition-colors ${
                      activeTab === "review"
                        ? "underline underline-offset-1 text-[#000000]"
                        : " text-gray-700  hover:text-[#000000] "
                    }`}
                  >
                    โพสต์รีวิว
                  </p>
                  <p className="text-2xl">/</p>
                  <p
                    onClick={() => setActiveTab("question")}
                    className={`py-2 rounded-md font-semibold transition-colors ${
                      activeTab === "question"
                        ? "underline underline-offset-1 text-[#000000]"
                        : "text-gray-700 hover:text-[#000000]"
                    }`}
                  >
                    โพสต์คำถาม
                  </p>
                </div>

                {/* Review Form */}
                {activeTab === "review" && (
                  <form
                    onSubmit={handleSubmitReview}
                    className="space-y-4 animate-fadeIn"
                  >
                    <h3 className="text-xl font-semibold mb-4">โพสต์รีวิว</h3>

                    {/* wirting post */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        เขียนรีวิว...
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-md h-24"
                        placeholder="แบ่งปันประสบการณ์ของคุณ..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          เซค
                        </label>
                        <select
                          value={newReview.sec}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              sec: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">เลือกเซค</option>
                          <option value="760001">760001</option>
                          <option value="760002">760002</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          ภาคเรียน
                        </label>
                        <select
                          value={newReview.term}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              term: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">เลือกภาคเรียน</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          ปีการศึกษา
                        </label>
                        <select
                          value={newReview.year}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              year: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">เลือกปีการศึกษา</option>
                          <option value="2568">2568</option>
                          <option value="2567">2567</option>
                          <option value="2566">2566</option>
                          {/* หลักสูตรถึง 66 */}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          เกรดที่ได้
                        </label>
                        <select
                          value={newReview.grade}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              grade: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">เลือกเกรด</option>
                          <option value="A">A</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                          <option value="D+">D+</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </select>
                      </div>
                      <div className="">
                        <div>
                          <label className=" text-sm font-medium mt-1 mb-1">
                            ดาว
                          </label>
                        </div>
                        <div className="mt-1.5">
                          <RatingStars
                            className=""
                            rating={newReview.rating}
                            onRatingChange={(value) =>
                              handleRatingChange("rating", value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-rows-1 gap-4 mb-4">
                      <div className="grid grid-cols-2">
                        <label className=" text-sm font-medium mt-1 mb-1 ">
                          จำนวนการบ้าน
                        </label>
                        <RatingStars
                          rating={newReview.homework}
                          onRatingChange={(value) =>
                            handleRatingChange("homework", value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2">
                        <label className=" text-sm font-medium mt-1 mb-1">
                          ความน่าสนใจ
                        </label>
                        <RatingStars
                          rating={newReview.interest}
                          onRatingChange={(value) =>
                            handleRatingChange("interest", value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2">
                        <label className="  text-sm font-medium mt-1 mb-1">
                          การสอนของอาจารย์
                        </label>
                        <RatingStars
                          rating={newReview.teaching}
                          onRatingChange={(value) =>
                            handleRatingChange("teaching", value)
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      โพสต์รีวิว
                    </button>
                  </form>
                )}

                {/* Question Form */}
                {activeTab === "question" && (
                  <form
                    onSubmit={handleSubmitQuestion}
                    className="space-y-4 animate-fadeIn"
                  >
                    <h3 className="text-xl font-semibold mb-4">โพสต์คำถาม</h3>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ถามคำถาม...
                      </label>
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="มีคำถามอะไรเกี่ยวกับวิชานี้?"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      ถามคำถาม
                    </button>
                  </form>
                )}
              </section>
            </div>
          )}
        </div>

        <div className="max-w-7xl  relative w-7xl  mx-auto p-6 bg-white rounded-lg shadow-lg">
          {/* Reviews Section */}
          <div className="grid grid-cols-2 ">
            <section className="mb-8 pr-5 border-r-2 border-[#c4c4c43c] ">
              <h3 className="text-2xl font-semibold mb-4">REVIEW</h3>

              <div className="space-y-6">
                {reviews.map((review) => {
                  const { likes, dislikes, userReaction } = reactions[review.id];
                  

                  return (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-lg">
                            {review.username}
                          </span>
                          <span className="text-gray-500 ml-4">
                            {review.postDate}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">คะแนนรีวิว:</span>
                          <RatingStars
                            rating={review.ratings.rating}
                            readOnly={true}
                          />
                        </div>

                        <div className="flex justify-end pb-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            เกรด {review.grade}
                          </span>
                        </div>

                        {/* ปุ่มถูกใจ / ไม่ถูกใจ */}
                        <div className="grid grid-cols-2">
                          <button
                            onClick={() => handleLike(review.id)}
                            className="flex items-center gap-1 hover:scale-105 transition-transform"
                          >
                            <HeartIcon
                              className={`h-6 w-6 ${
                                userReaction === "like"
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            />
                            {likes}
                          </button>

                          <button
                            onClick={() => handleDislike(review.id)}
                            className="flex items-center gap-1 hover:scale-105 transition-transform"
                          >
                            <FaceFrownIcon
                              className={`h-6 w-6 ${
                                userReaction === "dislike"
                                  ? "text-blue-500"
                                  : "text-gray-500"
                              }`}
                            />
                            {dislikes}
                          </button>
                        </div>
                      </div>

                      {/* ปุ่มเปิด/ปิด dropdown */}
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setOpenId(openId === review.id ? null : review.id)
                          }
                          className="text-gray-500 hover:text-gray-700 transition-transform"
                        >
                          {openId === review.id ? (
                            <ChevronDoubleUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDoubleDownIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      {/* เนื้อหาที่ซ่อน / แสดง */}
                      {openId === review.id && (
                        <div className="mt-3 transition-all duration-300 ease-in-out">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                            <div>
                              <p>เซค {review.sec}</p>
                            </div>
                            <div>
                              <p>ภาคเรียน {review.term}</p>
                            </div>
                            <div>
                              <p>ปีการศึกษา {review.year}</p>
                            </div>

                            <div>
                              <span className="text-gray-600">
                                จำนวนการบ้าน:
                              </span>
                              <RatingStars
                                rating={review.ratings.homework}
                                readOnly={true}
                              />
                            </div>
                            <div>
                              <span className="text-gray-600">
                                ความน่าสนใจ:
                              </span>
                              <RatingStars
                                rating={review.ratings.interest}
                                readOnly={true}
                              />
                            </div>
                            <div>
                              <span className="text-gray-600">
                                การสอนของอาจารย์:
                              </span>
                              <RatingStars
                                rating={review.ratings.teaching}
                                readOnly={true}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {review.replies.map((reply, index) => (
                        <div
                          key={index}
                          className="ml-6 mt-3 p-3 bg-gray-50 rounded"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-600">
                              {reply.username}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {reply.date}
                            </span>
                          </div>
                          <p className="text-gray-700">{reply.comment}</p>
                        </div>
                      ))}

                      {/* Reply Form */}
                      <div className="mt-3 relative">
                        <input
                          type="text"
                          placeholder="แสดงความคิดเห็น..."
                          value={replyContents[`review_${review.id}`] || ""}
                          onChange={(e) =>
                            setReplyContents({
                              ...replyContents,
                              [`review_${review.id}`]: e.target.value,
                            })
                          }
                          className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <PaperAirplaneIcon
                          onClick={() =>
                            handleReply(
                              "review",
                              review.id,
                              replyContents[`review_${review.id}`] || ""
                            )
                          }
                          className="h-5 w-5 text-gray-500 hover:text-[#ababab] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Questions Section */}
            <section className="mb-8 pl-5">
              <h3 className="text-2xl font-semibold mb-4">QUESTION</h3>

              <div className="space-y-6">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="border-b border-gray-200 pb-6"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{question.username}</span>
                      <span className="text-gray-500 text-sm">คำถาม</span>
                    </div>

                    <p className="text-gray-700 mb-3">{question.question}</p>

                    {/* Answers */}
                    {question.replies.map((reply, index) => (
                      <div
                        key={index}
                        className="ml-6 mt-3 p-3 bg-yellow-50 rounded"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium text-green-600">
                            {reply.username}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {reply.date}
                          </span>
                        </div>
                        <p className="text-gray-700">{reply.answer}</p>
                      </div>
                    ))}

                    {/* Answer Form */}
                    <div
                      className="mt-3  relative
                    "
                    >
                      <input
                        type="text"
                        placeholder="ตอบคำถาม..."
                        value={replyContents[`question_${question.id}`] || ""}
                        onChange={(e) =>
                          setReplyContents({
                            ...replyContents,
                            [`question_${question.id}`]: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <PaperAirplaneIcon
                        onClick={() =>
                          handleReply(
                            "question",
                            question.id,
                            replyContents[`question_${question.id}`] || ""
                          )
                        }
                        className="h-5 w-5 text-gray-500 hover:text-[#ababab] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors "
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSub;
