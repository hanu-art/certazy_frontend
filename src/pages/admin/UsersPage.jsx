import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Mail,
    Phone,
    Calendar,
    Shield,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/styles/token";
import adminService from "@/services/adminService";
import authService from "@/services/authService";

// User Details Drawer Component
function UserDetailsDrawer({ user, isOpen, onClose }) {
    if (!user) return null;

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
                                    <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-gray-100"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Profile Section */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-blue-700">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={cn(
                                                "px-2 py-1 text-xs font-medium rounded-full",
                                                user.status === "active" 
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            )}>
                                                {user.status}
                                            </span>
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Join Date</p>
                                            <p className="text-sm font-medium text-gray-900">{user.joinDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield size={18} className="text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Role</p>
                                            <p className="text-sm font-medium text-gray-900 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Statistics */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Course Statistics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-2xl font-bold text-gray-900">{user.enrolledCourses}</p>
                                            <p className="text-sm text-gray-600">Enrolled Courses</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-2xl font-bold text-gray-900">{user.completedCourses}</p>
                                            <p className="text-sm text-gray-600">Completed Courses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Edit User
                                    </button>
                                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

// User Table Component
function UserTable({ users, onViewUser, onToggleStatus, onEditUser, onDeleteUser }) {
    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-red-100 text-red-800",
        };
        
        return (
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", styles[status])}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: "bg-purple-100 text-purple-800",
            student: "bg-blue-100 text-blue-800",
        };
        
        return (
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", styles[role])}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Role</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Courses</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Join Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    {getRoleBadge(user.role)}
                                </td>
                                <td className="py-3 px-4">
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{user.enrolledCourses} enrolled</p>
                                        <p className="text-gray-600">{user.completedCourses} completed</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {user.joinDate}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewUser(user)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => onEditUser(user)}
                                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                            title="Edit User"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onToggleStatus(user)}
                                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                            title={user.status === "active" ? "Deactivate" : "Activate"}
                                        >
                                            {user.status === "active" ? <UserX size={16} /> : <UserCheck size={16} />}
                                        </button>
                                        <button
                                            onClick={() => onDeleteUser(user)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete User"
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

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const usersPerPage = 10;
    const totalPages = Math.ceil(users.length / usersPerPage);

    // Load users
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Use auth service for user management as per existing API
                const response = await authService.getAllUsers();
                const usersData = response.data?.data?.users || [];
                
                setUsers(usersData.map(user => ({
                    id: user.id,
                    name: user.name || 'Unknown User',
                    email: user.email || 'unknown@example.com',
                    phone: user.phone || '+91 XXXXXXXXXX',
                    role: user.role || 'student',
                    status: user.status || 'inactive',
                    enrolledCourses: user.enrolledCourses || 0,
                    completedCourses: user.completedCourses || 0,
                    joinDate: new Date(user.createdAt).toLocaleDateString(),
                    lastActive: new Date(user.lastActive).toLocaleDateString(),
                })));
                
            } catch (err) {
                console.error("Error loading users:", err);
                if (err.response?.status === 404) {
                    setError("Users API endpoint not available. Please ensure backend is properly configured.");
                } else {
                    setError("Failed to load users");
                }
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === "all" || user.role === selectedRole;
        const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Get paginated users
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    const handleToggleStatus = async (user) => {
        try {
            const newStatus = user.status === "active" ? "inactive" : "active";
            await authService.updateUserStatus(user.id, { status: newStatus });
            setUsers(users.map(u => 
                u.id === user.id ? { ...u, status: newStatus } : u
            ));
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    const handleEditUser = (user) => {
        // TODO: Implement edit user functionality
        console.log("Edit user:", user);
    };

    const handleDeleteUser = (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            setUsers(users.filter(u => u.id !== user.id));
        }
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
                            <h3 className="text-lg font-medium text-red-900">Error Loading Users</h3>
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
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600 mt-1">Manage your platform users and their permissions</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add User
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
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="admin">Admins</option>
                        </select>
                        
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <Filter size={16} />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <UserTable
                users={paginatedUsers}
                onViewUser={handleViewUser}
                onToggleStatus={handleToggleStatus}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* User Details Drawer */}
            <UserDetailsDrawer
                user={selectedUser}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
}