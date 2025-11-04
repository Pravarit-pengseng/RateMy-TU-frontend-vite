import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { getCurrentProfile } from "../../../Function/profile";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PaperAirplaneIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  HeartIcon,
  FaceFrownIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  FaceFrownIcon as FaceFrownIconSolid,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_APP_API;

function ReviewSub() {
  const { courseCode, id } = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState("review");

  //  State สำหรับแก้ไข comment
  const [editingReviewComment, setEditingReviewComment] = useState(null);
  const [editingQuestionComment, setEditingQuestionComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  //  State สำหรับฟอร์มรีวิว (เพิ่ม _id)
  const initialReviewState = {
    _id: null,
    homework: 0,
    interest: 0,
    teaching: 0,
    comment: "",
    sec: "",
    term: "",
    year: "",
    grade: "",
    rating: 0,
  };
  const [newReview, setNewReview] = useState(initialReviewState);

  // State สำหรับฟอร์มคำถาม (เพิ่ม _id)
  const initialQuestionState = {
    _id: null,
    postText: "",
  };
  const [newQuestion, setNewQuestion] = useState(initialQuestionState);

  const [replyContents, setReplyContents] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [userProfiles, setUserProfiles] = useState({}); // เก็บ profile ของแต่ละ user

  // Debug: ดู userProfiles state เมื่อเปลี่ยน

  const loadUserProfile = async (username) => {
    try {
      const response = await axios.get(`${API}/profile/${username}`);

      if (response.data) {
        const profileImageUrl = response.data.profileImage;

        // ใช้ callback เพื่อตรวจสอบว่ามีใน cache แล้วหรือไม่
        setUserProfiles((prev) => {
          // ถ้ามีแล้ว ไม่ต้อง update
          if (prev[username]) {
            return prev;
          }

          return {
            ...prev,
            [username]: profileImageUrl || null,
          };
        });
      }
    } catch (error) {
      console.error(
        "  Failed to load profile for:",
        username,
        "->",
        error.message
      );
      // ถ้าดึงไม่ได้ให้เก็บเป็น null
      setUserProfiles((prev) => {
        if (prev[username] !== undefined) return prev;
        return {
          ...prev,
          [username]: null,
        };
      });
    }
  };
  const [userProfile, setUserProfile] = useState({
    username: "",
    profileImage: "",
  });
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.token) {
        try {
          const res = await getCurrentProfile(user.token);
          const data = res.data;
          setUserProfile({
            username: data.username || "",
            profileImage: data.profileImage ? data.profileImage.url : "",
          });
        } catch (err) {
          console.error("Load user profile error:", err);
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Load course data
  useEffect(() => {
    loadCourse();
    loadReviews();
    loadQuestions();
  }, [id, courseCode]);

  // โหลด user profiles เมื่อมี reviews หรือ questions
  const loadedUsersRef = useRef(new Set());

  useEffect(() => {
    const loadAllProfiles = async () => {
      const usernames = new Set();

      // รวบรวม username จาก review comments
      reviews.forEach((review) => {
        if (review.comments) {
          review.comments.forEach((comment) => {
            if (comment.username) {
              usernames.add(comment.username);
            }
          });
        }
      });

      // รวบรวม username จาก question comments
      questions.forEach((question) => {
        if (question.comments) {
          question.comments.forEach((comment) => {
            if (comment.username) {
              usernames.add(comment.username);
            }
          });
        }
      });

      // โหลด profile ของแต่ละคน (เฉพาะที่ยังไม่เคยโหลด)
      usernames.forEach((username) => {
        if (!loadedUsersRef.current.has(username)) {
          loadedUsersRef.current.add(username);
          loadUserProfile(username);
        }
      });
    };

    if (reviews.length > 0 || questions.length > 0) {
      loadAllProfiles();
    }
  }, [reviews, questions]);

  const loadCourse = async () => {
    try {
      const res = await axios.get(`${API}/course/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Load course error:", err);
      toast.error("ไม่สามารถโหลดข้อมูลวิชาได้");
    }
  };

  const loadReviews = async () => {
    try {
      const res = await axios.get(`${API}/allpostreview/${courseCode}`);
      const reviewsData = res.data;

      const reviewsWithComments = await Promise.all(
        reviewsData.map(async (review) => {
          try {
            const commentsRes = await axios.get(
              `${API}/allReviewComment/${review._id}`
            );
            return { ...review, comments: commentsRes.data.comments || [] };
          } catch {
            return { ...review, comments: [] };
          }
        })
      );

      setReviews(reviewsWithComments);
    } catch {
      setReviews([]);
    }
  };

  const loadQuestions = async () => {
    try {
      const res = await axios.get(`${API}/allQuestions/${courseCode}`);
      const questionsData = res.data.questions || [];

      const questionsWithComments = await Promise.all(
        questionsData.map(async (question) => {
          try {
            const commentsRes = await axios.get(
              `${API}/allQuestionComment/${question._id}`
            );
            return { ...question, comments: commentsRes.data.comments || [] };
          } catch {
            return { ...question, comments: [] };
          }
        })
      );

      setQuestions(questionsWithComments);
    } catch {
      // console.error("Load questions error:", err);
      setQuestions([]);
    }
  };

  // Fixed Like Handler
  const handleLike = async (reviewId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    const review = reviews.find((r) => r._id === reviewId);
    if (!review) return;

    const currentLikes = review.like || 0;
    const currentDislikes = review.disLike || 0;

    // Toggle like logic
    const hasLiked = review.userReaction === "like";
    const hasDisliked = review.userReaction === "dislike";

    let newLikes = currentLikes;
    let newDislikes = currentDislikes;
    let newReaction = null;

    if (hasLiked) {
      // Remove like
      newLikes = currentLikes - 1;
      newReaction = null;
    } else {
      // Add like
      newLikes = currentLikes + 1;
      newReaction = "like";
      // Remove dislike if exists
      if (hasDisliked) {
        newDislikes = currentDislikes - 1;
      }
    }

    // Optimistic update
    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r._id === reviewId
          ? {
              ...r,
              like: newLikes,
              disLike: newDislikes,
              userReaction: newReaction,
            }
          : r
      )
    );

    try {
      await axios.put(
        `${API}/editpost/${reviewId}`,
        {
          like: newLikes,
          disLike: newDislikes,
        },
        {
          headers: { authtoken: user.token },
        }
      );
    } catch (err) {
      console.error("Update like error:", err);
      toast.error("ไม่สามารถอัปเดตการถูกใจได้");
      // Revert on error
      loadReviews();
    }
  };

  //  Fixed Dislike Handler
  const handleDislike = async (reviewId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    const review = reviews.find((r) => r._id === reviewId);
    if (!review) return;

    const currentLikes = review.like || 0;
    const currentDislikes = review.disLike || 0;

    // Toggle dislike logic
    const hasLiked = review.userReaction === "like";
    const hasDisliked = review.userReaction === "dislike";

    let newLikes = currentLikes;
    let newDislikes = currentDislikes;
    let newReaction = null;

    if (hasDisliked) {
      // Remove dislike
      newDislikes = currentDislikes - 1;
      newReaction = null;
    } else {
      // Add dislike
      newDislikes = currentDislikes + 1;
      newReaction = "dislike";
      // Remove like if exists
      if (hasLiked) {
        newLikes = currentLikes - 1;
      }
    }

    // Optimistic update
    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r._id === reviewId
          ? {
              ...r,
              like: newLikes,
              disLike: newDislikes,
              userReaction: newReaction,
            }
          : r
      )
    );

    try {
      await axios.put(
        `${API}/editpost/${reviewId}`,
        {
          like: newLikes,
          disLike: newDislikes,
        },
        {
          headers: { authtoken: user.token },
        }
      );
    } catch (err) {
      console.error("Update dislike error:", err);
      toast.error("ไม่สามารถอัปเดตการไม่ถูกใจได้");
      loadReviews();
    }
  };

  //  handleRatingChange
  const handleRatingChange = (category, value) => {
    setNewReview((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  //  handleSubmitReview
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อนโพสต์รีวิว");
      navigate("/login");
      return;
    }

    // (Validations...)
    if (!newReview.comment.trim()) {
      toast.error("กรุณาเขียนรีวิว");
      return;
    }
    if (!newReview.sec.trim()) {
      toast.error("กรุณาระบุเซค");
      return;
    }
    if (!newReview.term) {
      toast.error("กรุณาเลือกภาคเรียน");
      return;
    }
    if (!newReview.year) {
      toast.error("กรุณาเลือกปีการศึกษา");
      return;
    }
    if (!newReview.grade) {
      toast.error("กรุณาเลือกเกรด");
      return;
    }
    if (newReview.rating === 0) {
      toast.error("กรุณาให้คะแนนดาว");
      return;
    }

    try {
      const reviewData = {
        postText: newReview.comment,
        section: newReview.sec,
        semester: newReview.term,
        academicYear: newReview.year,
        grade: newReview.grade,
        starRating: newReview.rating,
        homeworkScore: newReview.homework * 20,
        interestScore: newReview.interest * 20,
        teachingScore: newReview.teaching * 20,
      };

      if (newReview._id) {
        await axios.put(`${API}/editpost/${newReview._id}`, reviewData, {
          headers: { authtoken: user.token },
        });
        toast.success("แก้ไขโพสต์รีวิวเสร็จสิ้น");
      } else {
        await axios.post(`${API}/postreview/${courseCode}`, reviewData, {
          headers: { authtoken: user.token },
        });
        toast.success("โพสต์รีวิวสำเร็จ");
      }

      setNewReview(initialReviewState); // รีเซ็ตฟอร์ม
      loadReviews();
      loadCourse();
    } catch (err) {
      console.error("Submit/Update review error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "โปรดกรอกข้อมูลให้ครบถ้วน";
      toast.error(errorMsg);
    }
  };

  //  รองรับการสร้างและแก้ไข
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อนถามคำถาม");
      navigate("/login");
      return;
    }

    if (!newQuestion.postText.trim()) {
      toast.error("กรุณาเขียนคำถาม");
      return;
    }

    try {
      const questionData = {
        questionText: newQuestion.postText,
      };

      if (newQuestion._id) {
        await axios.put(
          `${API}/updateQuestion/${newQuestion._id}`,
          questionData,
          {
            headers: { authtoken: user.token },
          }
        );
        toast.success("แก้ไขโพสต์คำถามสำเร็จ");
      } else {
        await axios.post(`${API}/question/${courseCode}`, questionData, {
          headers: { authtoken: user.token },
        });
        toast.success("โพสต์คำถามสำเร็จ");
      }

      setNewQuestion(initialQuestionState); // รีเซ็ตฟอร์ม
      loadQuestions();
    } catch (err) {
      console.error("Submit/Update question error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "ไม่สามารถโพสต์คำถามได้";
      toast.error(errorMsg);
    }
  };

  const handleReply = async (type, id, content) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น");
      return;
    }

    if (!content.trim()) return;

    try {
      if (type === "review") {
        await axios.post(
          `${API}/reviewComment/${id}`,
          {
            text: content,
          },
          {
            headers: { authtoken: user.token },
          }
        );

        const commentsRes = await axios.get(`${API}/allReviewComment/${id}`);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === id
              ? { ...review, comments: commentsRes.data.comments || [] }
              : review
          )
        );
      } else {
        await axios.post(
          `${API}/questionComment/${id}`,
          {
            commentText: content,
          },
          {
            headers: { authtoken: user.token },
          }
        );

        const commentsRes = await axios.get(`${API}/allQuestionComment/${id}`);
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === id
              ? { ...question, comments: commentsRes.data.comments || [] }
              : question
          )
        );
      }

      setReplyContents((prev) => ({ ...prev, [`${type}_${id}`]: "" }));
      toast.success("แสดงความคิดเห็นสำเร็จ");
    } catch (err) {
      console.error("Reply error:", err);
      toast.error("ไม่สามารถแสดงความคิดเห็นได้");
    }
  };

  // เริ่มแก้ไข comment ของ review
  const handleStartEditReviewComment = (comment) => {
    setEditingReviewComment(comment._id);
    setEditCommentText(comment.text || "");
  };

  // เริ่มแก้ไข comment ของ question
  const handleStartEditQuestionComment = (comment) => {
    setEditingQuestionComment(comment._id);
    setEditCommentText(comment.commentText || "");
  };

  // ยกเลิกการแก้ไข
  const handleCancelEditComment = () => {
    setEditingReviewComment(null);
    setEditingQuestionComment(null);
    setEditCommentText("");
  };

  // บันทึกการแก้ไข comment ของ review
  const handleSaveEditReviewComment = async (commentId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    if (!editCommentText.trim()) {
      toast.error("กรุณากรอกข้อความ");
      return;
    }

    try {
      await axios.put(
        `${API}/updateReviewComment/${commentId}`,
        { text: editCommentText },
        { headers: { authtoken: user.token } }
      );
      toast.success("แสดงความคิดเห็นเสร็จสิ้น");
      handleCancelEditComment();
      loadReviews();
    } catch (err) {
      console.error("Edit review comment error:", err);
      toast.error("ไม่สามารถแก้ไขความคิดเห็นได้");
    }
  };

  // บันทึกการแก้ไข comment ของ question
  const handleSaveEditQuestionComment = async (commentId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    if (!editCommentText.trim()) {
      toast.error("กรุณากรอกข้อความ");
      return;
    }

    try {
      await axios.put(
        `${API}/updateQuestioncomment/${commentId}`,
        { commentText: editCommentText },
        { headers: { authtoken: user.token } }
      );
      toast.success("แสดงความคิดเห็นเสร็จสิ้น");
      handleCancelEditComment();
      loadQuestions();
    } catch (err) {
      console.error("Edit question comment error:", err);
      toast.error("ไม่สามารถแก้ไขคำตอบได้");
    }
  };

  // ลบ comment ของ review
  const handleDeleteReviewComment = async (commentId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    console.log("delete review success log");

    try {
      await axios.delete(`${API}/deleteReviewComment/${commentId}`, {
        headers: { authtoken: user.token },
      });
      toast.success("ลบความคิดเห็นเสร็จสิ้น");
      loadReviews();
    } catch (err) {
      console.error("Delete review comment error:", err);
      toast.error("ไม่สามารถลบความคิดเห็นได้");
    }
  };

  // ลบ comment ของ question
  const handleDeleteQuestionComment = async (commentId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    console.log("delete question success log");

    try {
      await axios.delete(`${API}/deleteQuestioncomment/${commentId}`, {
        headers: { authtoken: user.token },
      });
      toast.success("ลบความคิดเห็นเสร็จสิ้น");
      loadQuestions();
    } catch (err) {
      console.error("Delete question comment error:", err);
      toast.error("ไม่สามารถลบคำตอบได้");
    }
  };

  const toggleComments = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ฟังก์ชันดึง profile ของ user แต่ละคน

  const handleDeleteReview = async (reviewId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    try {
      // (ใช้ API endpoint จากโค้ดเดิม)
      await axios.delete(`${API}/deletepost/${reviewId}`, {
        headers: { authtoken: user.token },
      });

      toast.success("ลบโพสต์รีวิวเสร็จสิ้น");
      loadReviews();
      loadCourse(); // Reload to update avg score

      // เคลียร์ฟอร์มใน Sidebar ที่นี่ หลังจากลบสำเร็จ
      setNewReview(initialReviewState);
    } catch (err) {
      console.error("Delete review error:", err);
      toast.error("ไม่สามารถลบรีวิวได้");
    }
  };

  // handleDeleteQuestion (ให้แสดง Toast)
  const handleDeleteQuestion = async (questionId,commentId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    try {
      await axios.delete(`${API}/deleteQuestion/${questionId}`, {
        headers: { authtoken: user.token },
      });

      await axios.delete(`${API}/deleteReviewComment/${commentId}`, {
        headers: { authtoken: user.token },
      });
      toast.success("ลบโพสต์คำถามเสร็จสิ้น");
      loadQuestions();

      // เคลียร์ฟอร์มใน Sidebar ที่นี่ หลังจากลบสำเร็จ
      setNewQuestion(initialQuestionState);
    } catch (err) {
      console.error("Delete question error:", err);
      toast.error("ไม่สามารถลบโพสต์คำถามได้");
    }
  };

  // ฟังก์ชันสำหรับเริ่มแก้ไขใน Sidebar
  const handleStartEditInSidebar = (review) => {
    setIsOpen(true); // เปิด Sidebar
    setActiveTab("review"); //  สลับไปแท็บรีวิว

    //  นำข้อมูลรีวิวมาใส่ในฟอร์ม
    setNewReview({
      _id: review._id,
      comment: review.postText,
      sec: review.section,
      term: review.semester,
      year: review.academicYear,
      grade: review.grade,
      rating: review.starRating,
      homework: Math.round(review.homeworkScore / 20),
      interest: Math.round(review.interestScore / 20),
      teaching: Math.round(review.teachingScore / 20),
    });
  };

  const handleStartEditQuestion = (question) => {
    setIsOpen(true); // เปิด Sidebar
    setActiveTab("question"); //  สลับไปแท็บคำถาม

    // นำข้อมูลคำถามมาใส่ในฟอร์ม
    setNewQuestion({
      _id: question._id,
      postText: question.questionText,
    });
  };

  const RatingStars = ({ rating, onRatingChange, readOnly = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
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

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent  animate-spin mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex min-h-screen bg-[#2d2f3b]">
        {/* Sidebar */}
        <div
          className={`bg-[#ffffff] shadow-lg border-r border-gray-200 transition-all duration-300 ${
            isOpen ? "w-lg" : "w-14"
          } flex flex-col`}
        >
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

          {isOpen && (
            <div className="p-4 overflow-y-auto w-lg sm:w-screen  md:w-lg">
              <header className="text-center mb-8">
                <div className="bg-gray-100 p-4 ">
                  <h2 className="text-xl font-semibold">{course.name}</h2>
                  <p className="text-gray-600">{course.courseCode}</p>
                  <p className="text-gray-600">อาจารย์: {course.teacher}</p>
                  <div className="mt-2">
                    <span className="text-lg font-medium">
                      คะแนนเฉลี่ย {course.avgReviewScore?.toFixed(1) || 0}/5
                    </span>
                    <span className="text-gray-500 ml-4">
                      จำนวนรีวิว: {reviews.length}
                    </span>
                  </div>
                </div>
              </header>

              <section className="mb-8 bg-blue-50 p-6 rounded-lg transition-all duration-300">
                <div className="flex mb-6 gap-2">
                  <button
                    onClick={() => setActiveTab("review")}
                    className={`py-2 px-4 font-semibold transition-colors rounded-md ${
                      activeTab === "review"
                        ? "bg-[#26268c] text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    โพสต์รีวิว
                  </button>
                  <button
                    onClick={() => setActiveTab("question")}
                    className={`py-2 px-4 font-semibold transition-colors rounded-md ${
                      activeTab === "question"
                        ? "bg-[#26268c] text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    โพสต์คำถาม
                  </button>
                </div>

                {activeTab === "review" && (
                  <form
                    onSubmit={handleSubmitReview}
                    className="space-y-4 animate-fadeIn"
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      {newReview._id ? "แก้ไขรีวิว" : "โพสต์รีวิว"}
                    </h3>

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
                        className="w-full p-3 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="แบ่งปันประสบการณ์ของคุณ..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          เซค
                        </label>
                        <select
                          type="text"
                          value={newReview.sec}
                          onChange={(e) =>
                            setNewReview({ ...newReview, sec: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            setNewReview({ ...newReview, term: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            setNewReview({ ...newReview, year: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">เลือกปีการศึกษา</option>
                          <option value="2568">2568</option>
                          <option value="2567">2567</option>
                          <option value="2566">2566</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          คะแนนรีวิว
                        </label>
                        <RatingStars
                          rating={newReview.rating}
                          onRatingChange={(value) =>
                            handleRatingChange("rating", value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
                          จำนวนการบ้าน
                        </label>
                        <RatingStars
                          rating={newReview.homework}
                          onRatingChange={(value) =>
                            handleRatingChange("homework", value)
                          }
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
                          ความน่าสนใจ
                        </label>
                        <RatingStars
                          rating={newReview.interest}
                          onRatingChange={(value) =>
                            handleRatingChange("interest", value)
                          }
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
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

                    {/*  ปุ่มสำหรับฟอร์มรีวิว */}
                    <div className="flex flex-col gap-2">
                      <button
                        type="submit"
                        className={`w-full text-white px-6 py-3 rounded-md transition-colors font-medium ${
                          newReview._id
                            ? "bg-[#26268c] hover:bg-[#151563]" // สีปุ่มตอนแก้ไข
                            : "bg-[#26268c] hover:bg-[#151563]" // สีปุ่มตอนโพสต์ใหม่
                        }`}
                      >
                        {newReview._id ? "บันทึกการแก้ไข" : "โพสต์รีวิว"}
                      </button>

                      {/* Show Cancel and Delete buttons only in edit mode */}
                      {newReview._id && (
                        <>
                          <button
                            type="button"
                            onClick={() => setNewReview(initialReviewState)} // กดเพื่อรีเซ็ตฟอร์ม
                            className="w-full bg-[#9897e4] text-white px-6 py-2 rounded-md hover:bg-[#8886d4] transition-colors font-medium"
                          >
                            ยกเลิกการแก้ไข
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteReview(newReview._id);
                            }}
                            className="w-full bg-[#f8ad1f] text-white px-6 py-2 rounded-md hover:bg-[#e79e17] transition-colors font-medium"
                          >
                            ลบโพสต์
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                )}

                {activeTab === "question" && (
                  <form
                    onSubmit={handleSubmitQuestion}
                    className="space-y-4 animate-fadeIn"
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      {newQuestion._id ? "แก้ไขคำถาม" : "โพสต์คำถาม"}
                    </h3>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ถามคำถาม...
                      </label>
                      {/* input เป็น Textarea และใช้ state object */}
                      <textarea
                        value={newQuestion.postText}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            postText: e.target.value,
                          })
                        }
                        placeholder="มีคำถามอะไรเกี่ยวกับวิชานี้?"
                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="submit"
                        className={`w-full text-white px-6 py-3 rounded-md transition-colors font-medium ${
                          newQuestion._id
                            ? "bg-[#26268c] hover:bg-[#151563]" // สีปุ่มตอนแก้ไข
                            : "bg-[#26268c] hover:bg-[#151563]" // สีปุ่มตอนโพสต์ใหม่ (สีเดิม)
                        }`}
                      >
                        {newQuestion._id ? "บันทึกการแก้ไข" : "ถามคำถาม"}
                      </button>

                      {/* Show Cancel and Delete buttons only in edit mode */}
                      {newQuestion._id && (
                        <>
                          <button
                            type="button"
                            onClick={() => setNewQuestion(initialQuestionState)} // กดเพื่อรีเซ็ตฟอร์ม
                            className="w-full bg-[#9897e4] text-white px-6 py-2 rounded-md hover:bg-[#8886d4] transition-colors font-medium"
                          >
                            ยกเลิกการแก้ไข
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteQuestion(newQuestion._id,);
                            }}
                            className="w-full bg-[#f8ad1f] text-white px-6 py-2 rounded-md hover:bg-[#e79e17] transition-colors font-medium"
                          >
                            ลบคำถาม
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                )}
              </section>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reviews Section */}
              <section className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                  REVIEW ({reviews.length})
                </h3>

                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      ยังไม่มีรีวิว
                    </p>
                  ) : (
                    reviews.map((review) => {
                      const isOwner = user?.username === review.username;
                      const likes = review.like || 0;
                      const dislikes = review.disLike || 0;
                      const userReaction = review.userReaction || null;

                      return (
                        <div
                          key={review._id}
                          className="border-b border-gray-200 pb-6 last:border-b-0"
                        >
                          {/*  Inline Edit UI  */}
                          <>
                            {/* Display Mode */}
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                <span className="w-10 h-10 bg-blue-50 rounded-full overflow-hidden flex items-center justify-center">
                                  {userProfiles[review.username] ? (
                                    <img
                                      src={userProfiles[review.username]}
                                      alt={review.username}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/default-avatar.png";
                                      }}
                                    />
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-full h-full text-gray-400 p-1"
                                    >
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                    </svg>
                                  )}
                                </span>
                                <span className="font-bold text-lg text-gray-800 ml-1">
                                  {review.username}
                                </span>
                                <span className="text-gray-500 text-sm ml-3">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Edit/Delete Buttons - Only show for owner */}
                              {isOwner && (
                                <div className="flex gap-1">
                                  {/*  onClick ปุ่มแก้ไขรีวิว */}
                                  <button
                                    onClick={() =>
                                      handleStartEditInSidebar(review)
                                    }
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="แก้ไข"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <p className="text-gray-700 mb-3 leading-relaxed">
                              {review.postText}
                            </p>

                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600">
                                  คะแนนรีวิว
                                </span>
                                <RatingStars
                                  rating={review.starRating}
                                  readOnly={true}
                                />
                              </div>
                              <span className="bg-[#26268c] text-white px-3 py-1 rounded-full text-sm font-medium">
                                เกรด {review.grade}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 mb-3">
                              <button
                                onClick={() => handleLike(review._id)}
                                disabled={!user?.token}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                                  userReaction === "like"
                                    ? "bg-red-50 text-red-600"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                } ${
                                  !user?.token
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                {userReaction === "like" ? (
                                  <HeartIconSolid className="w-5 h-5" />
                                ) : (
                                  <HeartIcon className="w-5 h-5" />
                                )}
                                <span className="font-medium">{likes}</span>
                              </button>

                              <button
                                onClick={() => handleDislike(review._id)}
                                disabled={!user?.token}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                                  userReaction === "dislike"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                } ${
                                  !user?.token
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              >
                                {userReaction === "dislike" ? (
                                  <FaceFrownIconSolid className="w-5 h-5" />
                                ) : (
                                  <FaceFrownIcon className="w-5 h-5" />
                                )}
                                <span className="font-medium">{dislikes}</span>
                              </button>

                              <button
                                onClick={() =>
                                  setOpenId(
                                    openId === review._id ? null : review._id
                                  )
                                }
                                className="ml-auto text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors"
                                title={
                                  openId === review._id
                                    ? "ซ่อนรายละเอียด"
                                    : "แสดงรายละเอียด"
                                }
                              >
                                {openId === review._id ? (
                                  <ChevronDoubleUpIcon className="h-5 w-5" />
                                ) : (
                                  <ChevronDoubleDownIcon className="h-5 w-5" />
                                )}
                              </button>
                            </div>

                            {openId === review._id && (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3 animate-fadeIn">
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                  <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">
                                      เซค
                                    </span>
                                    <span className="text-gray-800">
                                      {review.section}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">
                                      ภาคเรียน
                                    </span>
                                    <span className="text-gray-800">
                                      {review.semester}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">
                                      ปีการศึกษา
                                    </span>
                                    <span className="text-gray-800">
                                      {review.academicYear}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-gray-200">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                      จำนวนการบ้าน:
                                    </span>
                                    <RatingStars
                                      rating={Math.round(
                                        review.homeworkScore / 20
                                      )}
                                      readOnly={true}
                                    />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                      ความน่าสนใจ:
                                    </span>
                                    <RatingStars
                                      rating={Math.round(
                                        review.interestScore / 20
                                      )}
                                      readOnly={true}
                                    />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                      การสอนของอาจารย์:
                                    </span>
                                    <RatingStars
                                      rating={Math.round(
                                        review.teachingScore / 20
                                      )}
                                      readOnly={true}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Comments */}
                            {(review.comments || []).length > 0 && (
                              <div className="mt-4 space-y-2">
                                <button
                                  onClick={() =>
                                    toggleComments(`review_${review._id}`)
                                  }
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-3 text-sm"
                                >
                                  {expandedComments[`review_${review._id}`] ? (
                                    <>
                                      <ChevronDoubleUpIcon className="h-4 w-4" />
                                      ซ่อนความคิดเห็น ({review.comments.length})
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDoubleDownIcon className="h-4 w-4" />
                                      แสดงความคิดเห็น ({review.comments.length})
                                    </>
                                  )}
                                </button>
                                {expandedComments[`review_${review._id}`] && (
                                  <div className="space-y-2">
                                    {[...review.comments]
                                      .sort(
                                        (a, b) =>
                                          new Date(b.createdAt) -
                                          new Date(a.createdAt)
                                      )
                                      .map((comment, index) => {
                                        const isCommentOwner =
                                          user?.username === comment.username;

                                        return (
                                          <div
                                            key={index}
                                            className="ml-6 p-3 bg-[#dbdbfb]  rounded-lg border-l-4 border-[#26268c]"
                                          >
                                            {/* กำลังแก้ไข comment นี้ */}
                                            {editingReviewComment ===
                                            comment._id ? (
                                              <div className="space-y-2">
                                                <textarea
                                                  value={editCommentText}
                                                  onChange={(e) =>
                                                    setEditCommentText(
                                                      e.target.value
                                                    )
                                                  }
                                                  className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                                                  rows={3}
                                                />
                                                <div className="flex gap-3">
                                                  <button
                                                    onClick={() =>
                                                      handleSaveEditReviewComment(
                                                        comment._id
                                                      )
                                                    }
                                                    className="p-1.5 bg-[#26268c] text-white rounded-md hover:bg-[#1f1f81] transition-colors"
                                                    title="บันทึก"
                                                  >
                                                    <CheckIcon className="h-4 w-4" />
                                                  </button>
                                                  <button
                                                    onClick={
                                                      handleCancelEditComment
                                                    }
                                                    className="p-1.5 bg-[#8c8ae3] text-black rounded-md hover:bg-[#8180dc] transition-colors"
                                                    title="ยกเลิก"
                                                  >
                                                    <XMarkIcon className="h-4 w-4" />
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      handleDeleteReviewComment(
                                                        comment._id
                                                      )
                                                    }
                                                    className="p-1.5 bg-[#f8ad1f] text-gray-700 rounded-md hover:bg-[#e29a15] transition-colors"
                                                    title="ยกเลิก"
                                                  >
                                                    <TrashIcon className="h-4 w-4" />
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <>
                                                <div className="flex justify-between items-start mb-1">
                                                  <div className="flex items-center gap-2">
                                                    {/* Profile Image */}
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                      {userProfiles[
                                                        comment.username
                                                      ] ? (
                                                        <img
                                                          src={
                                                            userProfiles[
                                                              comment.username
                                                            ]
                                                          }
                                                          alt={comment.username}
                                                          className="w-full h-full object-cover"
                                                          onError={(e) => {
                                                            e.target.onerror =
                                                              null;
                                                            e.target.src =
                                                              "/default-avatar.png";
                                                          }}
                                                        />
                                                      ) : (
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          viewBox="0 0 24 24"
                                                          fill="currentColor"
                                                          className="w-full h-full text-gray-400 p-1"
                                                        >
                                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                                        </svg>
                                                      )}
                                                    </div>
                                                    <span
                                                      className={`font-semibold ${
                                                        isCommentOwner
                                                          ? "text-black"
                                                          : "text-black"
                                                      }`}
                                                    >
                                                      {comment.username}
                                                      {isCommentOwner && (
                                                        <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                                          คุณ
                                                        </span>
                                                      )}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-gray-600 text-xs">
                                                      {new Date(
                                                        comment.createdAt
                                                      ).toLocaleDateString(
                                                        "th-TH"
                                                      )}
                                                    </span>
                                                    {isCommentOwner && (
                                                      <div className="flex gap-1">
                                                        <button
                                                          onClick={() =>
                                                            handleStartEditReviewComment(
                                                              comment
                                                            )
                                                          }
                                                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                          title="แก้ไข"
                                                        >
                                                          <PencilIcon className="h-3.5 w-3.5" />
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                <p className="text-gray-800 text-sm">
                                                  {comment.text}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Reply Input */}
                            <div className="mt-3 relative">
                              <input
                                type="text"
                                placeholder={
                                  user?.token
                                    ? "แสดงความคิดเห็น..."
                                    : "เข้าสู่ระบบเพื่อแสดงความคิดเห็น"
                                }
                                value={
                                  replyContents[`review_${review._id}`] || ""
                                }
                                onChange={(e) =>
                                  setReplyContents({
                                    ...replyContents,
                                    [`review_${review._id}`]: e.target.value,
                                  })
                                }
                                disabled={!user?.token}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleReply(
                                      "review",
                                      review._id,
                                      replyContents[`review_${review._id}`] ||
                                        ""
                                    );
                                  }
                                }}
                              />
                              <button
                                onClick={() =>
                                  handleReply(
                                    "review",
                                    review._id,
                                    replyContents[`review_${review._id}`] || ""
                                  )
                                }
                                disabled={
                                  !user?.token ||
                                  !replyContents[`review_${review._id}`]?.trim()
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <PaperAirplaneIcon className="h-5 w-5 text-blue-600" />
                              </button>
                            </div>
                          </>
                          {/* )} */}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Questions Section */}
              <section className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                  QUESTION ({questions.length})
                </h3>

                <div className="space-y-6">
                  {questions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      ยังไม่มีคำถาม
                    </p>
                  ) : (
                    questions.map((question) => {
                      const isOwner = user?.username === question.username;

                      return (
                        <div
                          key={question._id}
                          className="border-b border-gray-200 pb-6 last:border-b-0"
                        >
                          {/* --- 20. (ลบ) Inline Edit UI --- */}
                          {/* {editingQuestion?._id === question._id ? ( ... ) : ( ... )} */}

                          <>
                            {/* Display Mode */}
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                <span className="w-10 h-10 bg-blue-50 rounded-full overflow-hidden flex items-center justify-center">
                                  {userProfiles[question.username] ? (
                                    <img
                                      src={userProfiles[question.username]}
                                      alt={question.username}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/default-avatar.png";
                                      }}
                                    />
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-full h-full text-gray-400 p-1"
                                    >
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                    </svg>
                                  )}
                                </span>
                                <span className="font-bold text-lg text-gray-800 ml-1">
                                  {question.username}
                                </span>
                                <span className="text-gray-500 text-sm ml-3">
                                  {new Date(
                                    question.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Edit/Delete Buttons - Only show for owner */}
                              {isOwner && (
                                <div className="flex gap-1">
                                  {/* --- 21. (แก้ไข) onClick ปุ่มแก้ไขคำถาม --- */}
                                  <button
                                    onClick={() =>
                                      handleStartEditQuestion(question)
                                    }
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="แก้ไข"
                                  >
                                    {/* (เปลี่ยนจาก PencilSquareIcon เป็น PencilIcon) */}
                                    <PencilIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                              {question.questionText}
                            </p>

                            {/* Answers */}
                            {(question.comments || []).length > 0 && (
                              <div className="mt-4">
                                <button
                                  onClick={() =>
                                    toggleComments(`question_${question._id}`)
                                  }
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-3 text-sm"
                                >
                                  {expandedComments[
                                    `question_${question._id}`
                                  ] ? (
                                    <>
                                      <ChevronDoubleUpIcon className="h-4 w-4" />
                                      ซ่อนความคิดเห็น (
                                      {question.comments.length})
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDoubleDownIcon className="h-4 w-4" />
                                      แสดงความคิดเห็น (
                                      {question.comments.length})
                                    </>
                                  )}
                                </button>
                                {expandedComments[
                                  `question_${question._id}`
                                ] && (
                                  <div className="space-y-2">
                                    {[...question.comments]
                                      .sort(
                                        (a, b) =>
                                          new Date(b.createdAt) -
                                          new Date(a.createdAt)
                                      )
                                      .map((comment, index) => {
                                        const isCommentOwner =
                                          user?.username === comment.username;

                                        return (
                                          <div
                                            key={index}
                                            className="ml-6 p-3 bg-[#dbdbfb]  rounded-lg border-l-4 border-[#26268c]"
                                          >
                                            {/* ถ้ากำลังแก้ไข comment นี้ */}
                                            {editingQuestionComment ===
                                            comment._id ? (
                                              <div className="space-y-2">
                                                <textarea
                                                  value={editCommentText}
                                                  onChange={(e) =>
                                                    setEditCommentText(
                                                      e.target.value
                                                    )
                                                  }
                                                  className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                                  rows={3}
                                                />
                                                <div className="flex gap-3">
                                                  <button
                                                    onClick={() =>
                                                      handleSaveEditQuestionComment(
                                                        comment._id
                                                      )
                                                    }
                                                    className="p-1.5 bg-[#26268c] text-white rounded-md hover:bg-[#1f1f81] transition-colors"
                                                    title="บันทึก"
                                                  >
                                                    <CheckIcon className="h-4 w-4" />
                                                  </button>
                                                  <button
                                                    onClick={
                                                      handleCancelEditComment
                                                    }
                                                    className="p-1.5 bg-[#8c8ae3] text-black rounded-md hover:bg-[#8180dc] transition-colors"
                                                    title="ยกเลิก"
                                                  >
                                                    <XMarkIcon className="h-4 w-4" />
                                                  </button>
                                                  {/* mark tester */}
                                                  <button
                                                    onClick={() =>
                                                      handleDeleteQuestionComment(
                                                        comment._id
                                                      )
                                                    }
                                                    className="p-1.5 bg-[#f8ad1f] text-gray-700 rounded-md hover:bg-[#e29a15] transition-colors"
                                                    title="ยกเลิก"
                                                  >
                                                    <TrashIcon className="h-4 w-4" />
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <>
                                                <div className="flex justify-between items-start mb-1">
                                                  <div className="flex items-center gap-2">
                                                    {/* Profile Image */}
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                      {userProfiles[
                                                        comment.username
                                                      ] ? (
                                                        <img
                                                          src={
                                                            userProfiles[
                                                              comment.username
                                                            ]
                                                          }
                                                          alt={comment.username}
                                                          className="w-full h-full object-cover"
                                                          onError={(e) => {
                                                            e.target.onerror =
                                                              null;
                                                            e.target.src =
                                                              "/default-avatar.png";
                                                          }}
                                                        />
                                                      ) : (
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          viewBox="0 0 24 24"
                                                          fill="currentColor"
                                                          className="w-full h-full text-gray-400 p-1"
                                                        >
                                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                                        </svg>
                                                      )}
                                                    </div>
                                                    {/* Owner */}
                                                    <span
                                                      className={`font-semibold ${
                                                        isCommentOwner
                                                          ? "text-black"
                                                          : "text-black"
                                                      }`}
                                                    >
                                                      {comment.username}
                                                      {isCommentOwner && (
                                                        <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                                          คุณ
                                                        </span>
                                                      )}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-gray-600 text-xs">
                                                      {new Date(
                                                        comment.createdAt
                                                      ).toLocaleDateString(
                                                        "th-TH"
                                                      )}
                                                    </span>
                                                    {isCommentOwner && (
                                                      <div className="flex gap-1">
                                                        <button
                                                          onClick={() =>
                                                            handleStartEditQuestionComment(
                                                              comment
                                                            )
                                                          }
                                                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                          title="แก้ไข"
                                                        >
                                                          <PencilIcon className="h-3.5 w-3.5" />
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                <p className="text-gray-800 text-sm">
                                                  {comment.commentText}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Reply Input */}
                            <div className="mt-3 relative">
                              <input
                                type="text"
                                placeholder={
                                  user?.token
                                    ? "แสดงความคิดเห็น..."
                                    : "เข้าสู่ระบบเพื่อแสดงความคิดเห็น"
                                }
                                value={
                                  replyContents[`question_${question._id}`] ||
                                  ""
                                }
                                onChange={(e) =>
                                  setReplyContents({
                                    ...replyContents,
                                    [`question_${question._id}`]:
                                      e.target.value,
                                  })
                                }
                                disabled={!user?.token}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleReply(
                                      "question",
                                      question._id,
                                      replyContents[
                                        `question_${question._id}`
                                      ] || ""
                                    );
                                  }
                                }}
                              />
                              <button
                                onClick={() =>
                                  handleReply(
                                    "question",
                                    question._id,
                                    replyContents[`question_${question._id}`] ||
                                      ""
                                  )
                                }
                                disabled={
                                  !user?.token ||
                                  !replyContents[
                                    `question_${question._id}`
                                  ]?.trim()
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <PaperAirplaneIcon className="h-5 w-5 text-blue-600" />
                              </button>
                            </div>
                          </>
                          {/* )} */}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSub;
