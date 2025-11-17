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

// --- 1. (เพิ่ม) คอมโพเนนต์สำหรับยืนยันการลบ ---
const ConfirmToast = ({ closeToast, onConfirmDelete }) => (
  <div className="text-gray-900">
    <p className="font-bold mb-2">ยืนยันการลบ</p>
    <p className="mb-4">คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?</p>
    <div className="flex gap-2">
      <button
        onClick={() => {
          onConfirmDelete(); // 1. สั่งให้ฟังก์ชันลบทำงาน
          closeToast(); // 2. ปิด Toast นี้
        }}
        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700"
      >
        ตกลง, ลบเลย
      </button>
      <button
        onClick={closeToast} // แค่ปิด Toast
        className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-400"
      >
        ยกเลิก
      </button>
    </div>
  </div>
);
// --- สิ้นสุดคอมโพเนนต์ ---

function ReviewSub() {
  const { courseCode, id } = useParams();
  const { user } = useSelector((state) => state.user);

  // ⭐ Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  // ⭐ Ref เพื่อติดตามว่าโหลด reactions แล้วหรือยัง (สำหรับ hard reload)
  const reactionsLoadedRef = useRef(false);
  const navigate = useNavigate();

  // ⭐ Function สำหรับไปหน้า Profile
  const goToProfile = (username) => {
    if (username) {
      navigate(`/ViewProfile/${username}`);
    }
  };

  const [isOpen, setIsOpen] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState("review");

  // --- 2. State สำหรับแก้ไข comment ---
  const [editingReviewComment, setEditingReviewComment] = useState(null);
  const [editingQuestionComment, setEditingQuestionComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  // --- 3. (แก้ไข) State สำหรับฟอร์มรีวิว (เพิ่ม _id) ---
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
    gradeDistribution: "",
    gradecut: "",
  };
  const [newReview, setNewReview] = useState(initialReviewState);

  // --- 4. (แก้ไข) State สำหรับฟอร์มคำถาม (เพิ่ม _id) ---
  const initialQuestionState = {
    _id: null,
    postText: "",
  };
  const [newQuestion, setNewQuestion] = useState(initialQuestionState);

  const [replyContents, setReplyContents] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [userProfiles, setUserProfiles] = useState({}); // เก็บ profile ของแต่ละ user

  // Debug: ดู userProfiles state เมื่อเปลี่ยน
  useEffect(() => {
    // console.log("🔄 [State Change] userProfiles updated:", userProfiles);
    // console.log("👥 [State Change] Total profiles:", Object.keys(userProfiles).length);
  }, [userProfiles]);
  const loadUserProfile = async (username) => {
    // console.log("🔍 [loadUserProfile] Starting fetch for:", username);

    try {
      const response = await axios.get(`${API}/profile/${username}`);
      // console.log("📦 [API Response] Full response for", username, ":", response.data);

      if (response.data) {
        const profileImage = response.data.profileImage;
        // console.log("🖼️ [API Response] profileImage field:", profileImage);
        // console.log("🔍 [Type Check] profileImage type:", typeof profileImage);

        // ⭐ แก้ไข: รองรับทั้ง String และ Object
        let profileImageUrl = null;

        if (typeof profileImage === 'string') {
          // ถ้าเป็น String ใช้เลย
          profileImageUrl = profileImage;
          // console.log("✅ [String URL] Direct URL:", profileImageUrl);
        } else if (profileImage && typeof profileImage === 'object') {
          // ถ้าเป็น Object ดึง .url
          profileImageUrl = profileImage.url || null;
          // console.log("✅ [Object URL] Extracted URL:", profileImageUrl);
        }

        // console.log("✅ [Processed] Final URL to save:", profileImageUrl);

        setUserProfiles(prev => {
          if (prev[username]) {
            // console.log("⏭️ [Cache] Already exists for:", username);
            return prev;
          }
          // console.log("💾 [State] Saving profile for:", username, "URL:", profileImageUrl);
          return { ...prev, [username]: profileImageUrl };
        });
      }
    } catch (error) {
      console.error("❌ [Error] Failed to load profile for:", username, "->", error.message);
      // ถ้าดึงไม่ได้ให้เก็บเป็น null
      setUserProfiles(prev => {
        if (prev[username] !== undefined) return prev;
        return {
          ...prev,
          [username]: null
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
            profileImage: data.profileImage
              ? data.profileImage.url
              : "",
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

  // ⭐ โหลด userReactions เมื่อ user พร้อมและมี reviews (แก้ปัญหา hard reload)
  useEffect(() => {
    // console.log("🔄 [useEffect] Checking reactions load", {
    //   hasToken: !!user?.token,
    //   reviewsCount: reviews.length,
    //   alreadyLoaded: reactionsLoadedRef.current
    // });

    if (user?.token && reviews.length > 0 && !reactionsLoadedRef.current) {
      loadUserReactions();
    }
  }, [user?.token, reviews.length]);

  // โหลด user profiles เมื่อมี reviews หรือ questions
  const loadedUsersRef = useRef(new Set());

  useEffect(() => {
    // console.log("🎬 [useEffect] Profile loader triggered");
    // console.log("📝 [useEffect] Reviews count:", reviews.length, "Questions count:", questions.length);

    const loadAllProfiles = async () => {
      const usernames = new Set();

      reviews.forEach(review => {
        // console.log("🔍 [Review] Checking username:", review.username);
        if (review.username) usernames.add(review.username);

        review.comments?.forEach(comment => {
          // console.log("💬 [Review Comment] Checking username:", comment.username);
          if (comment.username) usernames.add(comment.username);
        });
      });

      questions.forEach(question => {
        // console.log("🔍 [Question] Checking username:", question.username);
        if (question.username) usernames.add(question.username);

        question.comments?.forEach(comment => {
          // console.log("💬 [Question Comment] Checking username:", comment.username);
          if (comment.username) usernames.add(comment.username);
        });
      });

      // console.log("📋 [Summary] Total unique usernames found:", Array.from(usernames));

      usernames.forEach(username => {
        if (!loadedUsersRef.current.has(username)) {
          // console.log("🆕 [Loading] New user:", username);
          loadedUsersRef.current.add(username);
          loadUserProfile(username);
        } else {
          // console.log("⏭️ [Skip] Already loaded:", username);
        }
      });
    };

    if (reviews.length > 0 || questions.length > 0) {
      loadAllProfiles();
    }
  }, [reviews, questions]);



  // ⭐ Scroll to specific post from notification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    if (postId && (reviews.length > 0 || questions.length > 0)) {
      console.log("🎯 [Scroll] Attempting to scroll to post:", postId);

      // รอให้ DOM render เสร็จ
      const scrollTimeout = setTimeout(() => {
        const reviewElement = document.getElementById(`review-${postId}`);
        const questionElement = document.getElementById(`question-${postId}`);
        const element = reviewElement || questionElement;

        if (element) {
          console.log("✅ [Scroll] Found element, scrolling...");

          // Scroll to element
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          // เพิ่ม highlight effect (สีเหลืองอ่อน)
          element.style.transition = 'all 0.5s ease';
          element.style.backgroundColor = '#fef3c7'; // yellow-100
          element.style.boxShadow = '0 0 0 4px #fbbf24'; // yellow-400

          // ลบ highlight หลัง 2 วินาที
          setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.boxShadow = '';
          }, 2000);

          console.log("✅ [Scroll] Scrolled to post successfully");

          // ลบ postId ออกจาก URL (optional)
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        } else {
          console.log("⚠️ [Scroll] Element not found:", `review-${postId}`, `question-${postId}`);
        }
      }, 1000); // รอ 1 วินาทีให้ DOM render เสร็จ

      return () => clearTimeout(scrollTimeout);
    }
  }, [reviews, questions]);
  const loadCourse = async () => {
    try {
      const res = await axios.get(`${API}/course/${courseCode || id}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Load course error:", err);
      toast.error("ไม่สามารถโหลดข้อมูลวิชาได้");
    }
  };

  // ⭐ โหลด userReaction สำหรับ reviews ที่มีอยู่แล้ว
  const loadUserReactions = async () => {
    if (!user?.token || reviews.length === 0) return;

    // ป้องกันการโหลดซ้ำ
    if (reactionsLoadedRef.current) {
      console.log("⏭️ [loadUserReactions] Already loaded, skipping");
      return;
    }

    console.log("🎨 [loadUserReactions] Loading reactions for", reviews.length, "reviews");

    try {
      const updatedReviews = await Promise.all(
        reviews.map(async (review) => {
          try {
            const reactionRes = await axios.get(
              `${API}/review/${review._id}/reaction`,
              {
                headers: { authtoken: user.token },
              }
            );
            return {
              ...review,
              userReaction: reactionRes.data.userReaction
            };
          } catch {
            return { ...review, userReaction: null };
          }
        })
      );
      setReviews(updatedReviews);
      reactionsLoadedRef.current = true; // ⭐ Mark as loaded
      console.log("✅ [loadUserReactions] Reactions loaded successfully");
    } catch (error) {
      console.error("❌ [loadUserReactions] Error:", error);
    }
  };

  const loadReviews = async () => {
    // Reset flag เมื่อโหลด reviews ใหม่
    reactionsLoadedRef.current = false;

    try {
      const res = await axios.get(`${API}/allpostreview/${courseCode}`);
      const reviewsData = res.data;

      // console.log("📦 [loadReviews] Raw data from API:", reviewsData.slice(0, 2));
      // console.log("📦 [loadReviews] First review username:", reviewsData[0]?.username);

      const reviewsWithComments = await Promise.all(
        reviewsData.map(async (review) => {
          // console.log("🔄 [Review] Processing review ID:", review._id, "Username:", review.username);
          try {
            // โหลด comments
            const commentsRes = await axios.get(
              `${API}/allReviewComment/${review._id}`
            );

            // โหลด userReaction (ถ้าล็อกอินอยู่)
            let userReaction = null;
            if (user?.token) {
              try {
                const reactionRes = await axios.get(
                  `${API}/review/${review._id}/reaction`,
                  {
                    headers: { authtoken: user.token },
                  }
                );
                userReaction = reactionRes.data.userReaction;
              } catch {
                // Silent error
              }
            }

            return {
              ...review,
              comments: commentsRes.data.comments || [],
              userReaction: userReaction
            };
          } catch {
            return { ...review, comments: [], userReaction: null };
          }
        })
      );

      // console.log("📊 [Reviews] Total loaded:", reviewsWithComments.length);
      // console.log("👥 [Reviews] With usernames:", reviewsWithComments.filter(r => r.username).map(r => r.username));
      setReviews(reviewsWithComments);
    } catch {
      // console.error("Load reviews error:", err);
      setReviews([]);
    }
  };

  const loadQuestions = async () => {
    try {
      const res = await axios.get(`${API}/allQuestions/${courseCode}`);
      const questionsData = res.data.questions || [];

      const questionsWithComments = await Promise.all(
        questionsData.map(async (question) => {
          // console.log("🔄 [Question] Processing question ID:", question._id, "Username:", question.username);
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

      // console.log("📊 [Questions] Total loaded:", questionsWithComments.length);
      // console.log("👥 [Questions] With usernames:", questionsWithComments.filter(q => q.username).map(q => q.username));
      setQuestions(questionsWithComments);
    } catch {
      // console.error("Load questions error:", err);
      setQuestions([]);
    }
  };

  // ✅ Fixed Like Handler (ใช้ Backend API ใหม่)
  const handleLike = async (reviewId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    const review = reviews.find((r) => r._id === reviewId);
    if (!review) return;

    console.log("❤️ [Like] Sending request to backend...");

    try {
      // เรียก Backend API ใหม่
      const response = await axios.post(
        `${API}/review/${reviewId}/like`,
        {},
        {
          headers: { authtoken: user.token },
        }
      );

      console.log("✅ [Like] Backend response:", {
        success: response.data.success,
        like: response.data.like,
        disLike: response.data.disLike,
        userReaction: response.data.userReaction,
      });

      if (response.data.success) {
        // อัพเดท state ด้วยข้อมูลจาก Backend
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r._id === reviewId
              ? {
                ...r,
                like: response.data.like,
                disLike: response.data.disLike,
                userReaction: response.data.userReaction,
              }
              : r
          )
        );
        console.log("✅ [Like] State updated successfully");
      }
    } catch (err) {
      console.error("❌ [Like] Error:", err);
      console.error("❌ [Like] Details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error("ไม่สามารถอัปเดตการถูกใจได้");
    }
  };

  // ✅ Fixed Dislike Handler (ใช้ Backend API ใหม่)
  const handleDislike = async (reviewId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    const review = reviews.find((r) => r._id === reviewId);
    if (!review) return;

    console.log("👎 [Dislike] Sending request to backend...");

    try {
      // เรียก Backend API ใหม่
      const response = await axios.post(
        `${API}/review/${reviewId}/dislike`,
        {},
        {
          headers: { authtoken: user.token },
        }
      );

      console.log("✅ [Dislike] Backend response:", {
        success: response.data.success,
        like: response.data.like,
        disLike: response.data.disLike,
        userReaction: response.data.userReaction,
      });

      if (response.data.success) {
        // อัพเดท state ด้วยข้อมูลจาก Backend
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r._id === reviewId
              ? {
                ...r,
                like: response.data.like,
                disLike: response.data.disLike,
                userReaction: response.data.userReaction,
              }
              : r
          )
        );
        console.log("✅ [Dislike] State updated successfully");
      }
    } catch (err) {
      console.error("❌ [Dislike] Error:", err);
      console.error("❌ [Dislike] Details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error("ไม่สามารถอัปเดตการไม่ถูกใจได้");
    }
  };

  // --- 5. (แก้ไข) handleRatingChange (ลบ logic ของ editingReview) ---
  const handleRatingChange = (category, value) => {
    // For new review (and edit mode via sidebar)
    setNewReview((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // --- 6. (แก้ไข) handleSubmitReview (รองรับการสร้างและแก้ไข) ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อนโพสต์รีวิว");
      navigate("/login");
      return;
    }

    // (Validations...)
    if (!newReview.comment.trim()) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!newReview.sec.trim()) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!newReview.term) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!newReview.year) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!newReview.grade) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (newReview.rating === 0) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (newReview.homework === 0) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน")
      return
    }
    if (newReview.interest === 0) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน")
      return
    }
    if (newReview.teaching === 0) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน")
      return
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
        gradeDistribution: newReview.gradeDistribution || "",
        gradecut: newReview.gradecut || "",
      };

      if (newReview._id) {
        // --- UPDATE (EDIT) LOGIC ---
        await axios.put(`${API}/editpost/${newReview._id}`, reviewData, {
          headers: { authtoken: user.token },
        });
        toast.success("แก้ไขรีวิวสำเร็จ");
      } else {
        // --- CREATE (NEW POST) LOGIC ---
        await axios.post(`${API}/postreview/${courseCode}`, reviewData, {
          headers: { authtoken: user.token },
        });
        toast.success("โพสต์รีวิวสำเร็จ");
      }

      setNewReview(initialReviewState); // รีเซ็ตฟอร์ม
      loadReviews();
      loadCourse(); // Reload to update avg score
    } catch (err) {
      console.error("Submit/Update review error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "โปรดกรอกข้อมูลให้ครบถ้วน";
      toast.error(errorMsg);
    }
  };

  // --- 7. (แก้ไข) handleSubmitQuestion (รองรับการสร้างและแก้ไข) ---
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อนถามคำถาม");
      navigate("/login");
      return;
    }

    if (!newQuestion.postText.trim()) {
      toast.error("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const questionData = {
        questionText: newQuestion.postText,
      };

      if (newQuestion._id) {
        // --- UPDATE (EDIT) LOGIC ---
        // (ใช้ API endpoint จากโค้ดเดิม)
        await axios.put(
          `${API}/updateQuestion/${newQuestion._id}`,
          questionData,
          {
            headers: { authtoken: user.token },
          }
        );
        toast.success("แก้ไขคำถามสำเร็จ");
      } else {
        // --- CREATE (NEW POST) LOGIC ---
        // (ใช้ API endpoint จากโค้ดเดิม)
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
        console.log("📝 [Review Comment] Posting comment:", {
          postId: id,
          text: content.substring(0, 50) + "..."
        });

        const response = await axios.post(
          `${API}/reviewComment`,  // ⭐ แก้: ไม่ต้องใส่ id ใน URL
          {
            postId: id,  // ⭐ แก้: ส่ง postId ใน body
            text: content,
          },
          {
            headers: { authtoken: user.token },
          }
        );

        console.log("✅ [Review Comment] Success:", response.data);

        const commentsRes = await axios.get(`${API}/allReviewComment/${id}`);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === id
              ? { ...review, comments: commentsRes.data.comments || [] }
              : review
          )
        );
      } else {
        console.log("❓ [Question Comment] Posting comment:", {
          postId: id,
          text: content.substring(0, 50) + "..."
        });

        const response = await axios.post(
          `${API}/questionComment`,  // ⭐ แก้: ไม่ต้องใส่ id ใน URL
          {
            postId: id,  // ⭐ แก้: ส่ง postId ใน body
            text: content,  // ⭐ แก้: ใช้ text แทน commentText
          },
          {
            headers: { authtoken: user.token },
          }
        );

        console.log("✅ [Question Comment] Success:", response.data);

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

  // --- 8. (ลบ) ฟังก์ชัน Inline Edit (ไม่ใช้แล้ว) ---
  // const handleEditReview = (review) => { ... };
  // const handleUpdateReview = async () => { ... };

  // --- 9. (แก้ไข) handleDeleteReview (ให้แสดง Toast) ---
  // ========== ฟังก์ชันใหม่สำหรับแก้ไข Comment ==========

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
    console.log("delete review success log")
    // if (!window.confirm("คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?")) {
    //   return;
    // }

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
    console.log("delete question success log")
    // if (!window.confirm("คุณต้องการลบคำตอบนี้ใช่หรือไม่?")) {
    //   return;
    // }

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

  // ========== สิ้นสุดฟังก์ชันใหม่ ==========

  const toggleComments = (id) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ฟังก์ชันดึง profile ของ user แต่ละคน


  const handleDeleteReview = async (reviewId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    performDelete(reviewId)
    // เรียกใช้ toast.warning เพื่อแสดง ConfirmToast
    // toast.warning(
    //   ({ closeToast }) => (
    //     <ConfirmToast
    //       closeToast={closeToast}
    //       onConfirmDelete={() => performDelete(reviewId)} // เมื่อกดยืนยัน ให้เรียก performDelete
    //     />
    //   ),
    //   {
    //     position: "top-center",
    //     autoClose: false,
    //     closeOnClick: false,
    //     draggable: false,
    //     pauseOnHover: true,
    //     closeButton: false,
    //   }
    // );
  };

  // --- 10. (เพิ่ม) performDelete (สำหรับลบรีวิวจริง) ---
  const performDelete = async (reviewId) => {
    try {
      console.log("🗑️ [Delete Review] Attempting to delete:", reviewId);

      // ✅ ต้องมี const response = 
      const response = await axios.delete(`${API}/deletepost/${reviewId}`, {
        headers: { authtoken: user.token },
      });

      console.log("✅ [Delete Review] Success:", response.data);
      toast.success("ลบรีวิวสำเร็จ");
      loadReviews();
      loadCourse();

      // เคลียร์ฟอร์มใน Sidebar ที่นี่ หลังจากลบสำเร็จ
      setNewReview(initialReviewState);

    } catch (err) {
      console.error("❌ [Delete Review] Error:", err);
      console.error("📝 [Error Details]:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        endpoint: `${API}/deletepost/${reviewId}`
      });

      const errorMsg = err.response?.data?.message ||
        err.response?.data?.error ||
        "ไม่สามารถลบรีวิวได้";
      toast.error(errorMsg);
    }
  };

  // --- 11. (ลบ) ฟังก์ชัน Inline Edit (ไม่ใช้แล้ว) ---
  // const handleEditQuestion = (question) => { ... };
  // const handleUpdateQuestion = async () => { ... };

  // --- 12. (แก้ไข) handleDeleteQuestion (ให้แสดง Toast) ---
  const handleDeleteQuestion = async (questionId) => {
    if (!user?.token) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    performDeleteQuestion(questionId)
    // เรียกใช้ toast.warning เพื่อแสดง ConfirmToast
    // toast.warning(
    //   ({ closeToast }) => (
    //     <ConfirmToast
    //       closeToast={closeToast}
    //       onConfirmDelete={() => performDeleteQuestion(questionId)} // เรียกฟังก์ชันลบคำถาม
    //     />
    //   ),
    //   {
    //     position: "top-center",
    //     autoClose: false,
    //     closeOnClick: false,
    //     draggable: false,
    //     pauseOnHover: true,
    //     closeButton: false,
    //   }
    // );
  };

  // --- 13. (เพิ่ม) performDeleteQuestion (สำหรับลบคำถามจริง) ---
  const performDeleteQuestion = async (questionId) => {
    try {
      console.log("🗑️ [Delete Question] Attempting to delete:", questionId);
      console.log("🔑 [Token] Using token:", user.token.substring(0, 20) + "...");

      // ✅ เพิ่ม const response = 
      const response = await axios.delete(`${API}/deleteQuestion/${questionId}`, {
        headers: { authtoken: user.token },
      });

      console.log("✅ [Delete Question] Success:", response.data);
      toast.success("ลบคำถามสำเร็จ");
      loadQuestions();

      // เคลียร์ฟอร์มใน Sidebar ที่นี่ หลังจากลบสำเร็จ
      setNewQuestion(initialQuestionState);

    } catch (err) {
      console.error("❌ [Delete Question] Error:", err);
      console.error("📝 [Error Details]:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        endpoint: `${API}/deleteQuestion/${questionId}`
      });

      const errorMsg = err.response?.data?.message ||
        err.response?.data?.error ||
        "ไม่สามารถลบคำถามได้";
      toast.error(errorMsg);
    }
  };

  // --- 14. (เพิ่ม) ฟังก์ชันสำหรับเริ่มแก้ไขใน Sidebar ---
  const handleStartEditInSidebar = (review) => {
    setIsOpen(true); // 1. เปิด Sidebar
    setActiveTab("review"); // 2. สลับไปแท็บรีวิว

    // 3. นำข้อมูลรีวิวมาใส่ในฟอร์ม
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
      gradeDistribution: review.gradeDistribution || "",
      gradecut: review.gradecut || "",
    });
  };

  const handleStartEditQuestion = (question) => {
    setIsOpen(true); // 1. เปิด Sidebar
    setActiveTab("question"); // 2. สลับไปแท็บคำถาม

    // 3. นำข้อมูลคำถามมาใส่ในฟอร์ม
    setNewQuestion({
      _id: question._id,
      // (ใช้ field 'questionText' จากโค้ดเดิม แต่ API ส่ง 'postText' มา... ต้องเช็ค)
      // จากโค้ดเดิม (line 1419) แสดง `question.questionText`
      // แต่ `handleEditQuestion` (line 552) ก็ใช้ `question.questionText`
      // ...แต่ `handleSubmitQuestion` (line 377) กลับส่ง `questionText: newQuestion` (ซึ่งเป็น string)
      // ...และ `loadQuestions` (line 116) ก็ไม่ได้ระบุ field
      // ***ผมจะยึดตามโค้ด `handleEditQuestion` เดิม (line 552) และ `handleUpdateQuestion` (line 569) ที่ใช้ `questionText`***
      // ***แต่ state `newQuestion` เดิม (line 55) เป็น string ธรรมดา***
      // ***ผมจะแก้ไขให้สอดคล้องกับ state ใหม่ `newQuestion.postText` ที่ผมสร้าง***

      // จากโค้ด `handleSubmitQuestion` (line 363) ที่คุณให้มา
      // `value={newQuestion}` (line 887) และ `onChange={(e) => setNewQuestion(e.target.value)}` (line 888)
      // แสดงว่า `newQuestion` *คือ string* ไม่ใช่ object
      // ผมจะยึดตามโค้ด `handleSubmitQuestion` ที่ผมแก้ในข้อ 7 ที่เปลี่ยน `newQuestion` เป็น object

      // สรุป: โค้ดที่ผมให้ในข้อ 4, 7, 13, 14, 15, 16, 17, 18, 19, 21, 23 สอดคล้องกันหมดแล้ว
      // `handleStartEditQuestion` จะใช้ `postText`
      // `handleSubmitQuestion` ก็จะส่ง `questionData = { questionText: newQuestion.postText }`
      // ***แต่*** `loadQuestions` (line 116) โหลด `question.questionText` (line 1419)
      // ***และ*** `handleEditQuestion` เดิม (line 552) ก็ใช้ `question.questionText`

      // ***โอเค ผมเจอจุดที่ต้องแก้ให้ถูกต้อง***
      // 1. `handleStartEditQuestion` ต้องใช้ `question.questionText`
      // 2. `handleSubmitQuestion` ต้องส่ง `questionText: newQuestion.postText` (อันนี้ถูกแล้ว)
      // 3. `UI (Question Card)` (line 1419) ต้องแสดง `question.questionText` (อันนี้ถูกแล้ว)
      postText: question.questionText, // <-- ใช้ 'questionText' จาก object ที่โหลดมา
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
            className={`${readOnly
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
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 ${isOpen ? "w-96 bg-[#ffffff] shadow-lg border-r border-gray-200" : "w-14 bg-transparent"
            } flex flex-col z-30 overflow-hidden`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-3 flex items-center justify-end transition-colors ${isOpen ? "hover:bg-gray-100" : "hover:bg-gray-700/50"
              }`}
          >
            {isOpen ? (
              <ChevronDoubleLeftIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <ChevronDoubleRightIcon className="w-6 h-6 text-white" />
            )}
          </button>

          {isOpen && (
            <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
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
                    className={`py-2 px-4 font-semibold transition-colors rounded-md ${activeTab === "review"
                      ? "bg-[#26268c] text-white"
                      : "text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    โพสต์รีวิว
                  </button>
                  <button
                    onClick={() => setActiveTab("question")}
                    className={`py-2 px-4 font-semibold transition-colors rounded-md ${activeTab === "question"
                      ? "bg-[#26268c] text-white"
                      : "text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    โพสต์คำถาม
                  </button>
                </div>

                {activeTab === "review" && (
                  isAdmin ? (
                    <div className="text-center py-8 text-gray-600 bg-white rounded-lg">
                      <p className="text-lg font-medium">Admin ไม่สามารถโพสต์รีวิวได้</p>
                      <p className="text-sm mt-2">คุณสามารถดูและจัดการรีวิวเท่านั้น</p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmitReview}
                      className="space-y-4 animate-fadeIn"
                    >
                      <h3 className="text-xl font-semibold mb-4">
                        {newReview._id ? "แก้ไขรีวิว" : "โพสต์รีวิว"}
                      </h3>

                      <div>
                        {/* <label className="block text-sm font-medium mb-2">
                          เขียนรีวิว...
                        </label> */}
                        <textarea
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              comment: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-[#26268c]"
                          placeholder="แบ่งปันประสบการณ์ของคุณ..."
                        // required
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
                          // required
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
                          // required
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
                          // required
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
                          // required
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
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          ตัดเกรด (ถ้ามี)
                          {/* <span className="text-gray-500 text-xs ml-1">- ไม่บังคับ</span> */}
                        </label>
                        <select
                          value={newReview.gradecut}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              gradecut: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">ตัดเกรด</option>
                          <option value="อิงเกณฑ์">อิงเกณฑ์</option>
                          <option value="อิงกลุ่ม">อิงกลุ่ม</option>
                        </select>
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
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            สัดส่วนคะแนน (ถ้ามี)
                            {/* <span className="text-gray-500 text-xs ml-1">- ไม่บังคับ</span> */}
                          </label>
                          <textarea
                            value={newReview.gradeDistribution}
                            onChange={(e) =>
                              setNewReview({
                                ...newReview,
                                gradeDistribution: e.target.value,
                              })
                            }
                            className="w-full p-3 border border-gray-300 rounded-md h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="เช่น สอบกลางภาค 30%, สอบปลายภาค 40%, งาน 30%"
                          />
                        </div>
                      </div>

                      {/* --- 15. (แก้ไข) ปุ่มสำหรับฟอร์มรีวิว (แบบไดนามิก) --- */}
                      <div className="flex flex-col gap-2">
                        <button
                          type="submit"
                          className={`w-full text-white px-6 py-3 rounded-md transition-colors font-medium ${newReview._id
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
                      {/* --- สิ้นสุดปุ่มไดนามิก --- */}
                    </form>
                  )
                )}

                {activeTab === "question" && (
                  isAdmin ? (
                    <div className="text-center py-8 text-gray-600 bg-white rounded-lg">
                      <p className="text-lg font-medium">Admin ไม่สามารถโพสต์คำถามได้</p>
                      <p className="text-sm mt-2">คุณสามารถดูและจัดการคำถามเท่านั้น</p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmitQuestion}
                      className="space-y-4 animate-fadeIn"
                    >
                      <h3 className="text-xl font-semibold mb-4">
                        {newQuestion._id ? "แก้ไขคำถาม" : "โพสต์คำถาม"}
                      </h3>

                      <div>
                        {/* <label className="block text-sm font-medium mb-2">
                          ถามคำถาม...
                        </label> */}
                        {/* --- 16. (แก้ไข) Input เป็น Textarea และใช้ state object --- */}
                        <textarea
                          value={newQuestion.postText}
                          onChange={(e) =>
                            setNewQuestion({ ...newQuestion, postText: e.target.value })
                          }
                          placeholder="มีคำถามอะไรเกี่ยวกับวิชานี้?"
                          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#26268c]"
                        // required
                        />
                      </div>

                      {/* --- 17. (แก้ไข) ปุ่มสำหรับฟอร์มคำถาม (แบบไดนามิก) --- */}
                      <div className="flex flex-col gap-2">
                        <button
                          type="submit"
                          className={`w-full text-white px-6 py-3 rounded-md transition-colors font-medium ${newQuestion._id
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
                                handleDeleteQuestion(newQuestion._id);
                              }}
                              className="w-full bg-[#f8ad1f] text-white px-6 py-2 rounded-md hover:bg-[#e79e17] transition-colors font-medium"
                            >
                              ลบคำถาม
                            </button>
                          </>
                        )}
                      </div>
                      {/* --- สิ้นสุดปุ่มไดนามิก --- */}
                    </form>
                  )
                )}
              </section>
            </div>
          )}
        </div>

        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isOpen ? "ml-96" : "ml-14"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-6 items-start
            sm:grid-cols-2 sm:gap-4
            md:grid-cols-2
            lg:grid-cols-2
            xl:grid-cols-2 
            ">
              {/* Reviews Section */}
              <section className="bg-white rounded-lg shadow-lg p-6 h-fit">
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
                      const isOwner = user?.studentId === review.studentId;
                      const likes = review.like || 0;
                      const dislikes = review.disLike || 0;
                      const userReaction = review.userReaction || null;

                      return (
                        <div
                          key={review._id}
                          id={`review-${review._id}`}
                          className="border-b border-gray-200 pb-6 last:border-b-0"
                        >
                          {/* --- 18. (ลบ) Inline Edit UI --- */}
                          {/* {editingReview?._id === review._id ? ( ... ) : ( ... )} */}

                          <>
                            {/* Display Mode */}
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                {/* Debug */}
                                {/* {console.log("🖼️ [Render Review]", {
                                  reviewId: review._id,
                                  username: review.username,
                                  hasInState: !!userProfiles[review.username],
                                  profileUrl: userProfiles[review.username],
                                  allProfiles: Object.keys(userProfiles)
                                })} */}
                                <span className="w-10 h-10 bg-blue-50 rounded-full overflow-hidden flex items-center justify-center"
                                  onClick={() => goToProfile(review.username)}
                                >
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
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400 p-1">
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

                              {/* Edit/Delete Buttons - Show Edit for owner, Delete for admin */}
                              {(isOwner || isAdmin) && (
                                <div className="flex gap-1">
                                  {isOwner && !isAdmin && (
                                    <button
                                      onClick={() => handleStartEditInSidebar(review)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                      title="แก้ไข"
                                    >
                                      <PencilIcon className="h-5 w-5" />
                                    </button>
                                  )}
                                  {isAdmin && (
                                    <button
                                      onClick={() => handleDeleteReview(review._id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                      title="ลบโพสต์"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  )}
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
                                disabled={!user?.token || isAdmin}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${userReaction === "like"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  } ${!user?.token || isAdmin
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
                                disabled={!user?.token || isAdmin}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${userReaction === "dislike"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  } ${!user?.token || isAdmin
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                  }`}
                              >
                                {userReaction === "dislike" ? (
                                  <FaceFrownIconSolid className="w-5 h-5" />
                                ) : (
                                  <FaceFrownIcon className="w-5 h-5" />
                                )}
                                <span className="font-medium">
                                  {dislikes}
                                </span>
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
                              <div className="mt-4 p-4 bg-purple-100 rounded-lg space-y-3 animate-fadeIn">
                                <div className="flex justify-between gap-3 text-sm ">
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
                                  {review.gradecut && (
                                    <div className="pt-2 border-t border-gray-200">
                                      <span className="text-sm text-gray-600 font-medium block mb-1">
                                        ตัดเกรด: <h className="text-sm text-gray-800 whitespace-pre-line">{review.gradecut}</h>
                                      </span>
                                      {/* <p className="text-sm text-gray-800 whitespace-pre-line">
                                        
                                      </p> */}
                                    </div>
                                  )}
                                  {review.gradeDistribution && (
                                    <div className="pt-2 border-t border-gray-200">
                                      <span className="text-sm text-gray-600 font-medium block mb-1">
                                        สัดส่วนคะแนน:
                                      </span>
                                      <p className="text-sm text-gray-800 whitespace-pre-line">
                                        {review.gradeDistribution}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Comments */}
                            {(review.comments || []).length > 0 && (
                              <div className="mt-4 space-y-2">
                                <button
                                  onClick={() => toggleComments(`review_${review._id}`)}
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
                                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                      .map((comment, index) => {
                                        const isCommentOwner = user?.studentId === comment.studentId

                                        return (
                                          <div
                                            key={index}
                                            className="ml-6 p-3 bg-[#ececff] rounded-lg border-l-4 border-[#26268c]"
                                          >
                                            {/* กำลังแก้ไข comment นี้ */}
                                            {editingReviewComment === comment._id ? (
                                              <div className="space-y-2">
                                                <textarea
                                                  value={editCommentText}
                                                  onChange={(e) => setEditCommentText(e.target.value)}
                                                  className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                                                  rows={3}
                                                />
                                                <div className="flex gap-3">
                                                  <button
                                                    onClick={() => handleSaveEditReviewComment(comment._id)}
                                                    className="p-1.5 bg-[#26268c] text-white rounded-md hover:bg-[#1f1f81] transition-colors"
                                                    title="บันทึก"
                                                  >
                                                    <CheckIcon className="h-4 w-4" />
                                                  </button>
                                                  <button
                                                    onClick={handleCancelEditComment}
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
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
                                                      onClick={() => goToProfile(comment.username)}
                                                    >
                                                      {userProfiles[comment.username] ? (
                                                        <img
                                                          src={userProfiles[comment.username]}
                                                          alt={comment.username}
                                                          className="w-full h-full object-cover"
                                                          onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/default-avatar.png";
                                                          }}
                                                        />
                                                      ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400 p-1">
                                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                                        </svg>
                                                      )}
                                                    </div>
                                                    <span className={`font-semibold ${isCommentOwner ? "text-blue-600" : "text-black"}`}>
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
                                                      ).toLocaleDateString("th-TH")}
                                                    </span>
                                                    {(isCommentOwner || isAdmin) && (
                                                      <div className="flex gap-1">
                                                        {isCommentOwner && !isAdmin && (
                                                          <button
                                                            onClick={() => handleStartEditReviewComment(comment)}
                                                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                            title="แก้ไข"
                                                          >
                                                            <PencilIcon className="h-3.5 w-3.5" />
                                                          </button>
                                                        )}
                                                        {isAdmin && (
                                                          <button
                                                            onClick={() => handleDeleteReviewComment(comment._id)}
                                                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                            title="ลบความคิดเห็น"
                                                          >
                                                            <TrashIcon className="h-3.5 w-3.5" />
                                                          </button>
                                                        )}
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
                                        )
                                      })
                                    }
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Reply Input - Disable for admin */}
                            {!isAdmin && (
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
                                      replyContents[`review_${review._id}`] ||
                                      ""
                                    )
                                  }
                                  disabled={
                                    !user?.token ||
                                    !replyContents[
                                      `review_${review._id}`
                                    ]?.trim()
                                  }
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <PaperAirplaneIcon className="h-5 w-5 text-blue-600" />
                                </button>
                              </div>
                            )}
                          </>
                          {/* )} */}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Questions Section */}
              <section className="bg-white rounded-lg shadow-lg p-6 h-fit">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                  QUESTION ({questions.length})
                </h3>

                <div className="space-y-6">
                  {questions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      ยังไม่มีคำถาม
                    </p>
                  ) : (
                    [...questions]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((question) => {
                        const isOwner = user?.studentId === question.studentId;

                        return (
                          <div
                            key={question._id}
                            id={`question-${question._id}`}  // ⭐ เพิ่ม id
                            className="border-b border-gray-200 pb-6 last:border-b-0"
                          >
                            {/* --- 20. (ลบ) Inline Edit UI --- */}
                            {/* {editingQuestion?._id === question._id ? ( ... ) : ( ... )} */}

                            <>
                              {/* Display Mode */}
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                  {/* {console.log("🖼️ [Render Question]", {
                                    questionId: question._id,
                                    username: question.username,
                                    hasInState: !!userProfiles[question.username],
                                    profileUrl: userProfiles[question.username],
                                    allProfiles: Object.keys(userProfiles)
                                  })} */}
                                  <span className="w-10 h-10 bg-blue-50 rounded-full overflow-hidden flex items-center justify-center"
                                    onClick={() => goToProfile(question.username)}
                                  >
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
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400 p-1">
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

                                {/* Edit/Delete Buttons - Show Edit for owner, Delete for admin */}
                                {(isOwner || isAdmin) && (
                                  <div className="flex gap-1">
                                    {isOwner && !isAdmin && (
                                      <button
                                        onClick={() =>
                                          handleStartEditQuestion(question)
                                        }
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="แก้ไข"
                                      >
                                        <PencilIcon className="w-5 h-5" />
                                      </button>
                                    )}
                                    {isAdmin && (
                                      <button
                                        onClick={() => handleDeleteQuestion(question._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="ลบคำถาม"
                                      >
                                        <TrashIcon className="w-5 h-5" />
                                      </button>
                                    )}
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
                                    onClick={() => toggleComments(`question_${question._id}`)}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-3 text-sm"
                                  >
                                    {expandedComments[`question_${question._id}`] ? (
                                      <>
                                        <ChevronDoubleUpIcon className="h-4 w-4" />
                                        ซ่อนความคิดเห็น ({question.comments.length})
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDoubleDownIcon className="h-4 w-4" />
                                        แสดงความคิดเห็น ({question.comments.length})
                                      </>
                                    )}
                                  </button>
                                  {expandedComments[`question_${question._id}`] && (
                                    <div className="space-y-2">
                                      {[...question.comments]
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .map((comment, index) => {
                                          const isCommentOwner = user?.studentId === comment.studentId

                                          return (
                                            <div
                                              key={index}
                                              className="ml-6 p-3 bg-[#ececff] rounded-lg border-l-4 border-[#26268c]"
                                            >
                                              {/* ถ้ากำลังแก้ไข comment นี้ */}
                                              {editingQuestionComment === comment._id ? (
                                                <div className="space-y-2">
                                                  <textarea
                                                    value={editCommentText}
                                                    onChange={(e) =>
                                                      setEditCommentText(e.target.value)
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
                                                      onClick={handleCancelEditComment}
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
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center"
                                                      onClick={() => goToProfile(comment.username)}
                                                    >
                                                      {userProfiles[comment.username] ? (
                                                        <img
                                                          src={userProfiles[comment.username]}
                                                          alt={comment.username}
                                                          className="w-full h-full object-cover"
                                                          onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/default-avatar.png";
                                                          }}
                                                        />
                                                      ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400 p-1">
                                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                                        </svg>
                                                      )}
                                                    </div>
                                                    <span className={`font-semibold ${isCommentOwner ? "text-blue-600" : "text-black"}`}>
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
                                                      ).toLocaleDateString("th-TH")}
                                                    </span>
                                                    {(isCommentOwner || isAdmin) && (
                                                      <div className="flex gap-1">
                                                        {isCommentOwner && !isAdmin && (
                                                          <button
                                                            onClick={() => handleStartEditQuestionComment(comment)}
                                                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                            title="แก้ไข"
                                                          >
                                                            <PencilIcon className="h-3.5 w-3.5" />
                                                          </button>
                                                        )}
                                                        {isAdmin && (
                                                          <button
                                                            onClick={() => handleDeleteQuestionComment(comment._id)}
                                                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                            title="ลบความคิดเห็น"
                                                          >
                                                            <TrashIcon className="h-3.5 w-3.5" />
                                                          </button>
                                                        )}
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
                                          )
                                        })
                                      }
                                    </div>

                                  )}
                                </div>
                              )}
                              {/* Reply Input - Disable for admin */}
                              {!isAdmin && (
                                <div className="mt-3 relative">
                                  <input
                                    type="text"
                                    placeholder={
                                      user?.token
                                        ? "ตอบคำถาม..."
                                        : "เข้าสู่ระบบเพื่อตอบคำถาม"
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
                                        replyContents[
                                        `question_${question._id}`
                                        ] || ""
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
                              )}
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


/* ⭐ Custom CSS สำหรับซ่อน scrollbar */
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`;

// เพิ่ม style tag
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}


export default ReviewSub;