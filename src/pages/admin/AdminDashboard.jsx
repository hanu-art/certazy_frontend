import React, { useState, useEffect } from "react";
import {
    Users,
    BookOpen,
    CreditCard,
    TrendingUp,
    DollarSign,
    UserCheck,
    Star,
    AlertCircle,
    Calendar,
    Download,
} from "lucide-react";
import { tokens } from "@/styles/token";
import { cn } from "@/lib/utils";
import adminService from "@/services/adminService";
import authService from "@/services/authService";
import enrollmentService from "@/services/enrollmentService";
import paymentService from "@/services/paymentService";
import reviewService from "@/services/reviewService";
import contactService from "@/services/contactService";

// Analytics Card Component
function AnalyticsCard({ title, value, change, icon, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        orange: "bg-orange-500",
    };

    const bgClasses = {
        blue: "bg-blue-50",
        green: "bg-green-50",
        purple: "bg-purple-50",
        orange: "bg-orange-50",
    };

    const textClasses = {
        blue: "text-blue-700",
        green: "text-green-700",
        purple: "text-purple-700",
        orange: "text-orange-700",
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && (
                        <p className={cn(
                            "text-sm font-medium mt-2",
                            change > 0 ? "text-green-600" : "text-red-600"
                        )}>
                            {change > 0 ? "+" : ""}{change}% from last month
                        </p>
                    )}
                </div>
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", bgClasses[color])}>
                    {React.createElement(icon, { className: cn("w-6 h-6", textClasses[color]) })}
                </div>
            </div>
        </div>
    );
}

// Revenue Chart Component
function RevenueChart({ data }) {
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-64 flex items-end justify-between gap-2">
                {data.map((item, index) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col items-center">
                            <div
                                className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                                style={{
                                    height: `${(item.revenue / maxRevenue) * 100}%`,
                                    minHeight: '20px'
                                }}
                            />
                            <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                            ₹{(item.revenue / 1000).toFixed(1)}k
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Recent Payments Table Component
function RecentPaymentsTable({ payments }) {
    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            failed: "bg-red-100 text-red-800",
        };
        
        return (
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", styles[status])}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Course</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900">{payment.user}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{payment.course}</td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">₹{payment.amount}</td>
                                <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">{payment.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Pending Reviews Component
function PendingReviews({ reviews }) {
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
        ));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pending Reviews</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                </button>
            </div>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900">{review.user}</span>
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{review.course}</p>
                                <p className="text-sm text-gray-700">{review.comment}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                                    <UserCheck size={16} />
                                </button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                    <AlertCircle size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Quick Actions Component
function QuickActions() {
    const actions = [
        { title: "Create Course", icon: BookOpen, color: "blue", href: "/admin/courses/create" },
        { title: "Manage Users", icon: Users, color: "green", href: "/admin/users" },
        { title: "View Reports", icon: Download, color: "purple", href: "/admin/reports" },
        { title: "Settings", icon: AlertCircle, color: "orange", href: "/admin/settings" },
    ];

    const getColorClasses = (color) => {
        const colorMap = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600", 
            purple: "bg-purple-100 text-purple-600",
            orange: "bg-orange-100 text-orange-600",
        };
        return colorMap[color] || "bg-gray-100 text-gray-600";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <button
                        key={action.title}
                        className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(action.color)}`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{action.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalCourses: 0,
        publishedCourses: 0,
        totalRevenue: 0,
        thisMonthRevenue: 0,
        pendingReviews: 0,
        pendingPayments: 0,
    });
    const [revenueData, setRevenueData] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load dashboard stats
                const statsResponse = await adminService.getDashboardStats();
                const dashboardStats = statsResponse.data?.data || {};
                setStats({
                    totalUsers: dashboardStats.totalUsers || 0,
                    activeUsers: dashboardStats.activeUsers || 0,
                    totalCourses: dashboardStats.totalCourses || 0,
                    publishedCourses: dashboardStats.publishedCourses || 0,
                    totalRevenue: dashboardStats.totalRevenue || 0,
                    thisMonthRevenue: dashboardStats.thisMonthRevenue || 0,
                    pendingReviews: dashboardStats.pendingReviews || 0,
                    pendingPayments: dashboardStats.pendingPayments || 0,
                });

                // Load revenue data
                const revenueResponse = await adminService.getRevenueOverview();
                setRevenueData(revenueResponse.data?.data?.monthly || []);

                // Load recent payments
                const paymentsResponse = await paymentService.getRecentPayments(5);
                const payments = paymentsResponse.data?.data?.payments || [];
                setRecentPayments(payments.map(payment => ({
                    id: payment.id,
                    user: payment.userName || 'Unknown User',
                    course: payment.courseName || 'Unknown Course',
                    amount: payment.amount || 0,
                    status: payment.status || 'unknown',
                    date: new Date(payment.createdAt).toLocaleDateString(),
                })));

                // Load pending reviews
                const reviewsResponse = await reviewService.getPendingReviews(5);
                const reviews = reviewsResponse.data?.data?.reviews || [];
                setPendingReviews(reviews.map(review => ({
                    id: review.id,
                    user: review.userName || 'Unknown User',
                    course: review.courseName || 'Unknown Course',
                    rating: review.rating || 0,
                    comment: review.comment || '',
                    date: new Date(review.createdAt).toLocaleDateString(),
                })));

            } catch (err) {
                console.error("Error loading dashboard data:", err);
                if (err.response?.status === 404) {
                    setError("Dashboard API endpoints not available. Please ensure backend is properly configured.");
                } else {
                    setError("Failed to load dashboard data");
                }
                
                // Set default values on error
                setStats({
                    totalUsers: 0,
                    activeUsers: 0,
                    totalCourses: 0,
                    publishedCourses: 0,
                    totalRevenue: 0,
                    thisMonthRevenue: 0,
                    pendingReviews: 0,
                    pendingPayments: 0,
                });
                setRevenueData([]);
                setRecentPayments([]);
                setPendingReviews([]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-600" />
                        <div>
                            <h3 className="text-lg font-medium text-red-900">Error Loading Dashboard</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform today.</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    change={12.5}
                    icon={Users}
                    color="blue"
                />
                <AnalyticsCard
                    title="Active Users"
                    value={stats.activeUsers.toLocaleString()}
                    change={8.2}
                    icon={UserCheck}
                    color="green"
                />
                <AnalyticsCard
                    title="Total Revenue"
                    value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`}
                    change={15.3}
                    icon={DollarSign}
                    color="purple"
                />
                <AnalyticsCard
                    title="Published Courses"
                    value={stats.publishedCourses}
                    change={5.1}
                    icon={BookOpen}
                    color="orange"
                />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart data={revenueData} />
                </div>
                <div>
                    <QuickActions />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentPaymentsTable payments={recentPayments} />
                <PendingReviews reviews={pendingReviews} />
            </div>
        </div>
    );
}
