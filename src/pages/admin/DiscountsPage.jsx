import { useState, useEffect } from "react";
import {
    Tag,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Percent,
    Clock,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import discountService from "@/services/discountService";

// Discount Form Component
function DiscountForm({ discount, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        code: discount?.code || "",
        description: discount?.description || "",
        discountType: discount?.discountType || "percentage",
        discountValue: discount?.discountValue || "",
        minAmount: discount?.minAmount || "",
        maxDiscount: discount?.maxDiscount || "",
        usageLimit: discount?.usageLimit || "",
        startDate: discount?.startDate || "",
        endDate: discount?.endDate || "",
        isActive: discount?.isActive !== undefined ? discount.isActive : true,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (discount?.id) {
                await discountService.update(discount.id, formData);
            } else {
                await discountService.create(formData);
            }
            onSave();
        } catch (error) {
            console.error("Error saving discount:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {discount?.id ? "Edit Discount" : "Create Discount"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Code
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="SAVE20"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Type
                        </label>
                        <select
                            value={formData.discountType}
                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {formData.discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
                        </label>
                        <input
                            type="number"
                            value={formData.discountValue}
                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={formData.discountType === "percentage" ? "20" : "500"}
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Amount
                        </label>
                        <input
                            type="number"
                            value={formData.minAmount}
                            onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="1000"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Discount
                        </label>
                        <input
                            type="number"
                            value={formData.maxDiscount}
                            onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="500"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Usage Limit
                        </label>
                        <input
                            type="number"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="100"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Special discount for new users..."
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active
                    </label>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : discount?.id ? "Update" : "Create"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

// Discount Details Modal Component
function DiscountDetailsModal({ discount, isOpen, onClose }) {
    if (!discount) return null;

    const getDiscountDisplay = () => {
        if (discount.discountType === "percentage") {
            return `${discount.discountValue}%`;
        } else {
            return `₹${discount.discountValue}`;
        }
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
                                    <h2 className="text-lg font-semibold text-gray-900">Discount Details</h2>
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
                                    {/* Discount Info */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Discount Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Code</span>
                                                <span className="text-sm font-medium text-gray-900 bg-blue-100 px-2 py-1 rounded">{discount.code}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Discount</span>
                                                <span className="text-sm font-medium text-gray-900">{getDiscountDisplay()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Status</span>
                                                <span className={cn(
                                                    "px-2 py-1 text-xs font-medium rounded-full",
                                                    discount.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                )}>
                                                    {discount.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Usage Info */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Usage Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Used</span>
                                                <span className="text-sm font-medium text-gray-900">{discount.usedCount || 0} / {discount.usageLimit || 'Unlimited'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Minimum Amount</span>
                                                <span className="text-sm font-medium text-gray-900">₹{discount.minAmount || 'No minimum'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Maximum Discount</span>
                                                <span className="text-sm font-medium text-gray-900">₹{discount.maxDiscount || 'No limit'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Info */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Validity Period</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Start Date</span>
                                                <span className="text-sm font-medium text-gray-900">{discount.startDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">End Date</span>
                                                <span className="text-sm font-medium text-gray-900">{discount.endDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {discount.description && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Description</h4>
                                            <p className="text-sm text-gray-600">{discount.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

// Discounts Table Component
function DiscountsTable({ discounts, onViewDetails, onEdit, onDelete }) {
    const getDiscountDisplay = (discount) => {
        if (discount.discountType === "percentage") {
            return `${discount.discountValue}%`;
        } else {
            return `₹${discount.discountValue}`;
        }
    };

    const getStatusBadge = (isActive) => {
        return (
            <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}>
                {isActive ? "Active" : "Inactive"}
            </span>
        );
    };

    const getUsageProgress = (used, limit) => {
        if (!limit) return null;
        const percentage = (used / limit) * 100;
        return (
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={cn(
                        "h-2 rounded-full",
                        percentage >= 80 ? "bg-red-500" : percentage >= 50 ? "bg-yellow-500" : "bg-green-500"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Code</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Discount</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Usage</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Validity</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {discounts.map((discount) => (
                            <tr key={discount.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Tag size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 bg-blue-50 px-2 py-1 rounded">{discount.code}</p>
                                            <p className="text-sm text-gray-600">{discount.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">{getDiscountDisplay(discount)}</span>
                                        {discount.minAmount && (
                                            <span className="text-xs text-gray-500">Min ₹{discount.minAmount}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="w-32">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>{discount.usedCount || 0}</span>
                                            <span>{discount.usageLimit || '∞'}</span>
                                        </div>
                                        {getUsageProgress(discount.usedCount || 0, discount.usageLimit)}
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{discount.startDate} - {discount.endDate}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    {getStatusBadge(discount.isActive)}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewDetails(discount)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(discount)}
                                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                            title="Edit Discount"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(discount)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete Discount"
                                        >
                                            <Trash2 size={16} />
                                        </button>
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

export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const discountsPerPage = 10;
    const totalPages = Math.ceil(discounts.length / discountsPerPage);

    // Load discounts
    useEffect(() => {
        const loadDiscounts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await discountService.getAllAdmin();
                const discountsData = response.data?.data?.discounts || [];
                
                setDiscounts(discountsData.map(discount => ({
                    id: discount.id,
                    code: discount.code || '',
                    description: discount.description || '',
                    discountType: discount.discountType || 'percentage',
                    discountValue: discount.discountValue || 0,
                    minAmount: discount.minAmount || 0,
                    maxDiscount: discount.maxDiscount || 0,
                    usageLimit: discount.usageLimit || null,
                    usedCount: discount.usedCount || 0,
                    startDate: new Date(discount.startDate).toLocaleDateString(),
                    endDate: new Date(discount.endDate).toLocaleDateString(),
                    isActive: discount.isActive !== false,
                })));
                
            } catch (err) {
                console.error("Error loading discounts:", err);
                if (err.response?.status === 404) {
                    setError("Discounts API endpoint not available. Please ensure backend is properly configured.");
                } else {
                    setError("Failed to load discounts");
                }
                setDiscounts([]);
            } finally {
                setLoading(false);
            }
        };

        loadDiscounts();
    }, []);

    // Filter discounts
    const filteredDiscounts = discounts.filter(discount => {
        const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            discount.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || 
                            (selectedStatus === "active" && discount.isActive) ||
                            (selectedStatus === "inactive" && !discount.isActive);
        
        return matchesSearch && matchesStatus;
    });

    // Get paginated discounts
    const paginatedDiscounts = filteredDiscounts.slice(
        (currentPage - 1) * discountsPerPage,
        currentPage * discountsPerPage
    );

    const handleViewDetails = (discount) => {
        setSelectedDiscount(discount);
        setIsDetailsModalOpen(true);
    };

    const handleEdit = (discount) => {
        setSelectedDiscount(discount);
        setIsFormModalOpen(true);
    };

    const handleDelete = (discount) => {
        if (window.confirm(`Are you sure you want to delete discount "${discount.code}"?`)) {
            discountService.delete(discount.id).then(() => {
                setDiscounts(discounts.filter(d => d.id !== discount.id));
            }).catch(error => {
                console.error("Error deleting discount:", error);
            });
        }
    };

    const handleSave = () => {
        setIsFormModalOpen(false);
        setSelectedDiscount(null);
        // Reload discounts
        discountService.getAllAdmin().then(response => {
            const discountsData = response.data?.data?.discounts || [];
            setDiscounts(discountsData.map(discount => ({
                id: discount.id,
                code: discount.code || '',
                description: discount.description || '',
                discountType: discount.discountType || 'percentage',
                discountValue: discount.discountValue || 0,
                minAmount: discount.minAmount || 0,
                maxDiscount: discount.maxDiscount || 0,
                usageLimit: discount.usageLimit || null,
                usedCount: discount.usedCount || 0,
                startDate: new Date(discount.startDate).toLocaleDateString(),
                endDate: new Date(discount.endDate).toLocaleDateString(),
                isActive: discount.isActive !== false,
            })));
        });
    };

    const handleCancel = () => {
        setIsFormModalOpen(false);
        setSelectedDiscount(null);
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
                            <h3 className="text-lg font-medium text-red-900">Error Loading Discounts</h3>
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
                    <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
                    <p className="text-gray-600 mt-1">Manage discount codes and promotional offers</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                    <button 
                        onClick={() => setIsFormModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Create Discount
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
                                placeholder="Search by code or description..."
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
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Filter size={16} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Discounts Table */}
            <DiscountsTable
                discounts={paginatedDiscounts}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Discount Details Modal */}
            <DiscountDetailsModal
                discount={selectedDiscount}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
            />

            {/* Discount Form Modal */}
            <DiscountForm
                discount={selectedDiscount}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    );
}