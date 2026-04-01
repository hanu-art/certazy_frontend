import { useState, useEffect } from "react";
import {
    BookOpen,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    Plus,
    Star,
    Users,
    DollarSign,
    Calendar,
    ToggleLeft,
    ToggleRight,
    ChevronLeft,
    ChevronRight,
    Image,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/styles/token";
import adminService from "@/services/adminService";
import courseService from "@/services/courseService";

// Course Card Component
function CourseCard({ course, onEdit, onDelete, onToggleStatus, onToggleFeatured, onView }) {
    const getStatusBadge = (status) => {
        const styles = {
            published: "bg-green-100 text-green-800",
            draft: "bg-yellow-100 text-yellow-800",
            archived: "bg-gray-100 text-gray-800",
        };
        
        return (
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", styles[status])}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getLevelBadge = (level) => {
        const styles = {
            beginner: "bg-blue-100 text-blue-800",
            intermediate: "bg-purple-100 text-purple-800",
            advanced: "bg-red-100 text-red-800",
        };
        
        return (
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", styles[level])}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
        );
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
        ));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-100">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x200?text=${course.title}`;
                    }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    {getStatusBadge(course.status)}
                    {course.isFeatured && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            Featured
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onToggleFeatured(course)}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                            title={course.isFeatured ? "Remove from featured" : "Add to featured"}
                        >
                            {course.isFeatured ? <Star size={16} className="fill-orange-600" /> : <Star size={16} />}
                        </button>
                        <button
                            onClick={() => onToggleStatus(course)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title={course.status === "published" ? "Unpublish" : "Publish"}
                        >
                            {course.status === "published" ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-2 mb-3">
                    {getLevelBadge(course.level)}
                    <span className="text-xs text-gray-500">{course.category}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{course.enrolledCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{course.lessonsCount} lessons</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {renderStars(course.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                            {course.rating} ({course.reviewCount})
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                            {course.originalPrice > course.price && (
                                <span className="text-sm text-gray-500 line-through">₹{course.originalPrice}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onView(course)}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                        View
                    </button>
                    <button
                        onClick={() => onEdit(course)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(course)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Course Table Component
function CourseTable({ courses, onEdit, onDelete, onToggleStatus, onToggleFeatured, onView }) {
    const getStatusBadge = (status) => {
        const styles = {
            published: "bg-green-100 text-green-800",
            draft: "bg-yellow-100 text-yellow-800",
            archived: "bg-gray-100 text-gray-800",
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
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Course</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Instructor</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Students</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = `https://via.placeholder.com/48x48?text=${course.title.charAt(0)}`;
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{course.title}</p>
                                            <p className="text-sm text-gray-600">{course.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">{course.instructor}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{course.enrolledCount}</td>
                                <td className="py-3 px-4">
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-900">₹{course.price}</span>
                                        {course.originalPrice > course.price && (
                                            <span className="text-gray-500 line-through ml-2">₹{course.originalPrice}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    {getStatusBadge(course.status)}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onView(course)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(course)}
                                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                            title="Edit Course"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onToggleStatus(course)}
                                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                            title={course.status === "published" ? "Unpublish" : "Publish"}
                                        >
                                            {course.status === "published" ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                        </button>
                                        <button
                                            onClick={() => onToggleFeatured(course)}
                                            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                            title={course.isFeatured ? "Remove from featured" : "Add to featured"}
                                        >
                                            {course.isFeatured ? <Star size={16} className="fill-orange-600" /> : <Star size={16} />}
                                        </button>
                                        <button
                                            onClick={() => onDelete(course)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete Course"
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

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid");
    const [error, setError] = useState(null);

    const coursesPerPage = 12;
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    // Load courses
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Use admin service for course management
                const response = await adminService.getCourses();
                const coursesData = response.data?.data?.courses || [];
                
                setCourses(coursesData.map(course => ({
                    id: course.id,
                    title: course.title || 'Untitled Course',
                    slug: course.slug || 'untitled-course',
                    description: course.description || '',
                    category: course.category?.name || 'Uncategorized',
                    level: course.level || 'beginner',
                    price: course.price || 0,
                    originalPrice: course.originalPrice || course.price || 0,
                    instructor: course.instructor?.name || 'Unknown Instructor',
                    thumbnail: course.thumbnail || 'https://via.placeholder.com/300x200',
                    status: course.status || 'draft',
                    isFeatured: course.isFeatured || false,
                    enrolledCount: course.enrolledCount || 0,
                    rating: course.rating || 0,
                    reviewCount: course.reviewCount || 0,
                    duration: course.duration || '0 hours',
                    lessonsCount: course.lessonsCount || 0,
                    createdAt: new Date(course.createdAt).toLocaleDateString(),
                    updatedAt: new Date(course.updatedAt).toLocaleDateString(),
                })));
                
            } catch (err) {
                console.error("Error loading courses:", err);
                if (err.response?.status === 404) {
                    setError("Courses API endpoint not available. Please ensure backend is properly configured.");
                } else {
                    setError("Failed to load courses");
                }
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
        const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
        const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;
        
        return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });

    // Get paginated courses
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * coursesPerPage,
        currentPage * coursesPerPage
    );

    const handleEdit = (course) => {
        // TODO: Implement edit course functionality
        console.log("Edit course:", course);
    };

    const handleDelete = async (course) => {
        if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
            try {
                await adminService.deleteCourse(course.id);
                setCourses(courses.filter(c => c.id !== course.id));
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    };

    const handleToggleStatus = async (course) => {
        try {
            const newStatus = course.status === "published" ? "draft" : "published";
            await adminService.toggleCourseStatus(course.id);
            setCourses(courses.map(c => 
                c.id === course.id ? { ...c, status: newStatus } : c
            ));
        } catch (error) {
            console.error("Error toggling course status:", error);
        }
    };

    const handleToggleFeatured = async (course) => {
        try {
            await adminService.toggleCourseFeatured(course.id);
            setCourses(courses.map(c => 
                c.id === course.id ? { ...c, isFeatured: !c.isFeatured } : c
            ));
        } catch (error) {
            console.error("Error toggling featured status:", error);
        }
    };

    const handleView = (course) => {
        // TODO: Implement view course functionality
        console.log("View course:", course);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-80 bg-gray-200 rounded"></div>
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
                            <h3 className="text-lg font-medium text-red-900">Error Loading Courses</h3>
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
                    <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                    <p className="text-gray-600 mt-1">Manage your course catalog and content</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Plus size={16} />
                        Create Course
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
                                placeholder="Search courses by title, description, or instructor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Programming">Programming</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                        </select>
                        
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>

                        <button
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <Filter size={16} />
                            Filters
                        </button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "px-3 py-2 rounded-lg transition-colors",
                                viewMode === "grid" 
                                    ? "bg-blue-600 text-white" 
                                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={cn(
                                "px-3 py-2 rounded-lg transition-colors",
                                viewMode === "table" 
                                    ? "bg-blue-600 text-white" 
                                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            Table
                        </button>
                    </div>
                </div>
            </div>

            {/* Courses Display */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            onToggleFeatured={handleToggleFeatured}
                            onView={handleView}
                        />
                    ))}
                </div>
            ) : (
                <CourseTable
                    courses={paginatedCourses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onToggleFeatured={handleToggleFeatured}
                    onView={handleView}
                />
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}