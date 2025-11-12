import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BellIcon } from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";

const API = import.meta.env.VITE_APP_API;

function NotificationDropdown() {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeTab, setActiveTab] = useState("all"); // "all" or "unread"
    const [loading, setLoading] = useState(false);

    // โหลด notifications
    const loadNotifications = async () => {
        if (!user?.token) return;

        setLoading(true);
        try {
            const response = await axios.get(`${API}/notifications`, {
                params: {
                    limit: 20,
                    unreadOnly: activeTab === "unread",
                },
                headers: { authtoken: user.token },
            });

            if (response.data.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error("Load notifications error:", error);
        } finally {
            setLoading(false);
        }
    };

    // โหลดเมื่อเปิด dropdown หรือเปลี่ยน tab
    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen, activeTab]);

    // โหลด unread count ทุก 30 วินาที
    useEffect(() => {
        if (!user?.token) return;

        const loadUnreadCount = async () => {
            try {
                const response = await axios.get(`${API}/notifications`, {
                    params: { limit: 1, unreadOnly: true },
                    headers: { authtoken: user.token },
                });
                if (response.data.success) {
                    setUnreadCount(response.data.unreadCount);
                }
            } catch (error) {
                console.error("Load unread count error:", error);
            }
        };

        loadUnreadCount();
        const interval = setInterval(loadUnreadCount, 30000); // ทุก 30 วินาที

        return () => clearInterval(interval);
    }, [user]);

    // Mark as read
    const markAsRead = async (notificationId) => {
        if (!user?.token) return;

        try {
            await axios.put(
                `${API}/notifications/${notificationId}/read`,
                {},
                { headers: { authtoken: user.token } }
            );

            // อัพเดท state
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, read: true } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Mark as read error:", error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        if (!user?.token) return;

        try {
            await axios.put(
                `${API}/notifications/read-all`,
                {},
                { headers: { authtoken: user.token } }
            );

            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Mark all as read error:", error);
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        markAsRead(notification._id);
        navigate(notification.link);
        setIsOpen(false);
    };

    // Get relative time
    const getRelativeTime = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        if (seconds < 60) return "เมื่อสักครู่";
        if (seconds < 3600) return `${Math.floor(seconds / 60)} นาทีที่แล้ว`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} ชั่วโมงที่แล้ว`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} วันที่แล้ว`;
        return new Date(date).toLocaleDateString("th-TH");
    };

    // Get notification icon/badge
    const getNotificationBadge = (type) => {
        const badges = {
            comment: { emoji: "💬", color: "bg-blue-500" },
            reply: { emoji: "↩️", color: "bg-green-500" },
            like: { emoji: "❤️", color: "bg-red-100" },
            dislike: { emoji: "👎", color: "bg-yellow-500" },
            mention: { emoji: "📌", color: "bg-purple-500" },
        };
        return badges[type] || { emoji: "🔔", color: "bg-gray-500" };
    };

    if (!user?.token) return null;

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
                {unreadCount > 0 ? (
                    <BellIconSolid className="w-6 h-6 text-gray-700" />
                ) : (
                    <BellIcon className="w-6 h-6 text-gray-700" />
                )}

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-lg">
                        <div className="flex items-center justify-between p-4">
                            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`flex-1 px-4 py-2 text-sm font-medium transition ${activeTab === "all"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setActiveTab("unread")}
                                className={`flex-1 px-4 py-2 text-sm font-medium transition ${activeTab === "unread"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                Unread
                                {unreadCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-[500px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <BellIcon className="w-16 h-16 mb-2 text-gray-300" />
                                <p className="text-sm">
                                    {activeTab === "unread"
                                        ? "No unread notifications"
                                        : "No notifications yet"}
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const badge = getNotificationBadge(notification.type);
                                return (
                                    <button
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition border-b border-gray-100 text-left ${!notification.read ? "bg-blue-50" : ""
                                            }`}
                                    >
                                        {/* Actor Profile Image */}
                                        <div className="relative flex-shrink-0">
                                            {notification.actorProfileImage ? (
                                                <img
                                                    src={notification.actorProfileImage}
                                                    alt={notification.actor}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg">
                                                    👤
                                                </div>
                                            )}

                                            {/* Type Badge */}
                                            <span
                                                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${badge.color} flex items-center justify-center text-xs`}
                                            >
                                                {badge.emoji}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 break-words">
                                                <span className="font-semibold">{notification.actor}</span>{" "}
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {getRelativeTime(notification.createdAt)}
                                            </p>
                                        </div>

                                        {/* Unread Indicator */}
                                        {!notification.read && (
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;