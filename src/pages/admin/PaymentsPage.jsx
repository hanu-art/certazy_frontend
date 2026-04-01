import { useState, useEffect } from "react";
import {
    CreditCard,
    Search,
    Filter,
    Download,
    Eye,
    RefreshCw,
    Calendar,
    DollarSign,
    User,
    BookOpen,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import adminService from "@/services/adminService";

// Payment Details Modal Component
function PaymentDetailsModal({ payment, isOpen, onClose }) {
    if (!payment) return null;

    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            failed: "bg-red-100 text-red-800",
            refunded: "bg-gray-100 text-gray-800",
        };
        
        return (
            <span className={cn("px-3 py-1 text-sm font-medium rounded-full", styles[status])}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className={cn(
            "fixed inset-0 z-50 overflow-hidden",
            isOpen ? "block" : "hidden"
        )}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
                <section className="absolute inset-y-0 right-0 max-w-full flex">
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-gray-100"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-6">
                                    {/* Status */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Status</span>
                                        {getStatusBadge(payment.status)}
                                    </div>

                                    {/* Amount */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Amount</span>
                                        <span className="text-2xl font-bold text-gray-900">₹{payment.amount}</span>
                                    </div>

                                    {/* User Info */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">User Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Name</span>
                                                <span className="text-sm font-medium text-gray-900">{payment.userName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Email</span>
                                                <span className="text-sm font-medium text-gray-900">{payment.userEmail}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Info */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Course Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Course</span>
                                                <span className="text-sm font-medium text-gray-900">{payment.courseName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Price</span>
                                                <span className="text-sm font-medium text-gray-900">₹{payment.coursePrice}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Method</span>
                                                <span className="text-sm font-medium text-gray-900">{payment.method}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Transaction ID</span>
                                                <span className="text-sm font-medium text-gray-900">{payment.transactionId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Date</span>
                                                <span className="text-sm font-medium text-gray-900">{payment.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

// Payments Table Component
function PaymentsTable({ payments, onViewDetails, onUpdateStatus }) {
    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            failed: "bg-red-100 text-red-800",
            refunded: "bg-gray-100 text-gray-800",
        };
        
        return (
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", styles[status])}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Payment ID</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Course</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Method</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900">
                                    #{payment.id}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <User size={14} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{payment.userName}</p>
                                            <p className="text-sm text-gray-600">{payment.userEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <BookOpen size={14} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{payment.courseName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    ₹{payment.amount}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {payment.method}
                                </td>
                                <td className="py-3 px-4">
                                    {getStatusBadge(payment.status)}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {payment.date}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewDetails(payment)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {payment.status === 'pending' && (
                                            <button
                                                onClick={() => onUpdateStatus(payment, 'completed')}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                title="Mark as Complete"
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedMethod, setSelectedMethod] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const paymentsPerPage = 10;
    const totalPages = Math.ceil(payments.length / paymentsPerPage);

    // Filter payments
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            payment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus;
        const matchesMethod = selectedMethod === "all" || payment.method === selectedMethod;
        
        return matchesSearch && matchesStatus && matchesMethod;
    });

    // Get paginated payments
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * paymentsPerPage,
        currentPage * paymentsPerPage
    );

    // Load payments
    useEffect(() => {
        const loadPayments = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Use admin service for payment management
                const response = await paymentService.getAllPayments();
                const paymentsData = response.data?.data?.payments || [];
                
                setPayments(paymentsData.map(payment => ({
                    id: payment.id,
                    userName: payment.user?.name || 'Unknown User',
                    userEmail: payment.user?.email || 'unknown@example.com',
                    courseName: payment.course?.title || 'Unknown Course',
                    amount: payment.amount || 0,
                    method: payment.method || 'Unknown',
                    status: payment.status || 'unknown',
                    transactionId: payment.transactionId || 'Unknown',
                    date: new Date(payment.createdAt).toLocaleDateString(),
                })));
                
            } catch (err) {
                console.error("Error loading payments:", err);
                if (err.response?.status === 404) {
                    setError("Payments API endpoint not available. Please ensure backend is properly configured.");
                } else {
                    setError("Failed to load payments");
                }
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, []);

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (payment, newStatus) => {
        try {
            await paymentService.updatePaymentStatus(payment.id, newStatus);
            setPayments(payments.map(p => 
                p.id === payment.id ? { ...p, status: newStatus } : p
            ));
        } catch (error) {
            console.error("Error updating payment status:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPayment(null);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
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
                            <h3 className="text-lg font-medium text-red-900">Error Loading Payments</h3>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                    <p className="text-gray-600 mt-1">Manage all payment transactions and status</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user, email, or course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        
                        <select
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Methods</option>
                            <option value="Razorpay">Razorpay</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Stripe">Stripe</option>
                        </select>

                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Filter size={16} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <PaymentsTable
                payments={paginatedPayments}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Payment Details Modal */}
            <PaymentDetailsModal
                payment={selectedPayment}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
}