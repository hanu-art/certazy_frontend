// src/pages/admin/CoursesPage.jsx

import { useState, useEffect, useCallback } from "react";
import {
    BookOpen, Search, Download, Plus, Star,
    Users, Eye, Edit2, Trash2, ChevronLeft,
    ChevronRight, ToggleLeft, ToggleRight, X,
    Save, Loader2, AlertCircle, CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import courseService   from "@/services/courseService";
import categoryService from "@/services/categoryService";

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVELS   = ["beginner", "intermediate", "advanced"];
const STATUSES = ["draft", "published", "archived"];
const PER_PAGE = 10;

const STATUS_STYLE = {
    published: { dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50",  label: "PUBLISHED"  },
    draft:     { dot: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50", label: "DRAFT"      },
    archived:  { dot: "bg-gray-400",   text: "text-gray-600",   bg: "bg-gray-100",  label: "ARCHIVED"   },
};

const LEVEL_STYLE = {
    beginner:     "bg-gray-100 text-gray-700",
    intermediate: "bg-blue-50 text-blue-700",
    advanced:     "bg-purple-50 text-purple-700",
};

const EMPTY_FORM = {
    title: "", slug: "", description: "", short_desc: "",
    category_id: "", thumbnail: "", preview_video: "",
    price: "", level: "beginner", language: "English",
    status: "draft", is_featured: false,
    requirements: "", what_you_learn: "", certificate_eligible: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
const fmtDate = (d) => !d ? "—" : new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtPrice = (p) => p == null ? "Free" : p === 0 ? "Free" : `₹${Number(p).toLocaleString("en-IN")}`;

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CoursesPage() {
    const [courses,    setCourses]    = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [page,       setPage]       = useState(1);

    // Filters
    const [search,   setSearch]   = useState("");
    const [status,   setStatus]   = useState("");
    const [level,    setLevel]    = useState("");
    const [catId,    setCatId]    = useState("");
    const [selectedParent, setSelectedParent] = useState("");  // For nested category logic

    // Modal
    const [showModal,  setShowModal]  = useState(false);
    const [editCourse, setEditCourse] = useState(null); // null = create mode
    const [saving,     setSaving]     = useState(false);
    const [form,       setForm]       = useState(EMPTY_FORM);

    // Delete confirm
    const [deleting,   setDeleting]   = useState(null);

    const totalPages = Math.ceil(totalCount / PER_PAGE);

    // ── Nested Category Handlers ───────────────────────────────────
    const handleParentCategoryChange = (parentId) => {
        setSelectedParent(parentId);
        setCatId(""); // Reset child category when parent changes
    };

    const handleChildCategoryChange = (childId) => {
        setCatId(childId);
    };

    const getSelectedCategory = () => {
        if (catId) return categories.find(c => c.id === Number(catId));
        if (selectedParent) return categories.find(c => c.id === Number(selectedParent));
        return null;
    };

    const getChildCategories = (parentId) => {
        const parent = categories.find(c => c.id === Number(parentId));
        return parent?.children || [];
    };

    // ── Form Category Handlers ───────────────────────────────────
    const [formParent, setFormParent] = useState("");
    const [formChild, setFormChild] = useState("");

    const handleFormParentChange = (parentId) => {
        setFormParent(parentId);
        setFormChild(""); // Reset child when parent changes
        setF("category_id", ""); // Clear form category_id
    };

    const handleFormChildChange = (childId) => {
        setFormChild(childId);
        setF("category_id", childId); // Set final category_id
    };

    const getFormSelectedCategory = () => {
        if (formChild) return categories.find(c => c.id === Number(formChild));
        if (formParent) return categories.find(c => c.id === Number(formParent));
        return null;
    };

    // ── Form Population for Edit Mode ───────────────────────────────
    const populateFormCategories = (course) => {
        if (course.category_id) {
            // Find if this is a child or parent category
            const isChild = categories.some(c => 
                c.children && c.children.some(child => child.id === course.category_id)
            );
            
            if (isChild) {
                // Find parent of this child
                const parent = categories.find(c => 
                    c.children && c.children.some(child => child.id === course.category_id)
                );
                if (parent) {
                    setFormParent(parent.id.toString());
                    setFormChild(course.category_id.toString());
                }
            } else {
                // This is a parent category
                setFormParent(course.category_id.toString());
                setFormChild("");
            }
        } else {
            setFormParent("");
            setFormChild("");
        }
    };

    // ── Load categories once ──────────────────────────────────────────────────
    useEffect(() => {
        categoryService.getAll()
            .then(r => setCategories(r.data?.data?.categories ?? []))
            .catch(() => {});
    }, []);

    // ── Load courses ──────────────────────────────────────────────────────────
    const loadCourses = useCallback(async () => {
        console.log("=== LOAD COURSES DEBUG ===");
        console.log("Page:", page);
        console.log("Search:", search);
        console.log("Status:", status);
        console.log("Level:", level);
        console.log("Category ID:", catId);
        
        setLoading(true);
        setError(null);
        try {
            const params = {
                page, limit: PER_PAGE,
                ...(search  && { search }),
                ...(level   && { level }),
                ...(catId   && { category_id: Number(catId) }),  // Back to category_id
                // status: send even if empty — backend default is published, 
                // but admin needs all statuses
                status: status || undefined,
            };
            // Admin needs all statuses — if no filter selected, fetch all
            if (!status) {
                // fetch without status filter — backend returns published by default
                // workaround: fetch draft + published + archived separately if needed
                // For now, send no status param to get all (backend may differ
                delete params.status;
            }
            
            console.log("API Params:", params);
            const r = await courseService.getAll(params); 
            console.log("API Response:", r);
            console.log("Response Data:", r.data);
            
            const courses = r.data?.data;
            console.log("Courses Data:", courses);
            console.log("Courses Count:", courses?.length);
            
            const pagination = r.data?.pagination;
            console.log("Pagination:", pagination);
            
            setCourses(Array.isArray(courses) ? courses : []);
            setTotalCount(pagination?.total ?? (Array.isArray(courses) ? courses.length : 0));
        } catch (e) {
            console.error("=== LOAD COURSES ERROR ===");
            console.error("Error:", e);
            console.error("Error Response:", e.response);
            console.error("Error Message:", e.response?.data?.message);
            setError(e.response?.data?.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    }, [page, search, status, level, catId]);

    useEffect(() => { loadCourses(); }, [loadCourses]);

    // Reset page on filter change
    useEffect(() => { setPage(1); }, [search, status, level, catId]);

    // ── Stats derived from current data ──────────────────────────────────────
    const stats = {
        total:     totalCount,
        published: courses.filter(c => c.status === "published").length,
        draft:     courses.filter(c => c.status === "draft").length,
        enrolled:  courses.reduce((s, c) => s + (c.enrolled_count ?? 0), 0),
    };

    // ── Modal helpers ─────────────────────────────────────────────────────────
    const openCreate = () => {
        setEditCourse(null);
        setForm(EMPTY_FORM);
        // Reset nested category fields
        setFormParent("");
        setFormChild("");
        setShowModal(true);
    };

    const openEdit = (course) => {
        setEditCourse(course);
        setForm({
            title:                course.title           ?? "",
            slug:                 course.slug             ?? "",
            description:          course.description      ?? "",
            short_desc:           course.short_desc       ?? "",
            category_id:          course.category_id      ?? "",
            thumbnail:            course.thumbnail        ?? "",
            preview_video:        course.preview_video    ?? "",
            price:                course.price            ?? "",
            level:                course.level            ?? "beginner",
            language:             course.language         ?? "English",
            status:               course.status           ?? "draft",
            is_featured:          !!course.is_featured,
            requirements:         course.requirements     ?? "",
            what_you_learn:       course.what_you_learn   ?? "",
            certificate_eligible: course.certificate_eligible ?? 0,
        });
        
        // Populate nested category fields
        populateFormCategories(course);
        
        setShowModal(true);
    };

    const [showStatusModal, setShowStatusModal] = useState(false);
const [selectedCourse, setSelectedCourse] = useState(null);

const handleSave = async (e) => {
        e.preventDefault();
        
        // Frontend Validation - Clear Error Messages
        if (!form.title.trim()) { 
            toast.error("Title is required (minimum 3 characters)"); 
            return; 
        }
        if (form.title.trim().length < 3) {
            toast.error("Title must be at least 3 characters long");
            return;
        }
        if (form.title.trim().length > 200) {
            toast.error("Title must be less than 200 characters");
            return;
        }
        if (!form.category_id) { 
            toast.error("Category is required"); 
            return; 
        }
        if (form.slug && form.slug.length > 220) {
            toast.error("Slug must be less than 220 characters");
            return;
        }
        if (form.short_desc && form.short_desc.length > 500) {
            toast.error("Short description must be less than 500 characters");
            return;
        }
        if (form.thumbnail && form.thumbnail.length > 500) {
            toast.error("Thumbnail URL must be less than 500 characters");
            return;
        }
        if (form.preview_video && form.preview_video.length > 500) {
            toast.error("Preview video URL must be less than 500 characters");
            return;
        }
        if (form.price && Number(form.price) < 0) {
            toast.error("Price must be 0 or greater");
            return;
        }
        if (form.language && form.language.length > 50) {
            toast.error("Language must be less than 50 characters");
            return;
        }
        if (form.certificate_eligible && ![0, 1].includes(Number(form.certificate_eligible))) {
            toast.error("Certificate eligible must be either 0 or 1");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                title: form.title.trim(),
                slug: form.slug?.trim() || undefined,
                description: form.description?.trim() || undefined,
                short_desc: form.short_desc?.trim() || undefined,
                category_id: Number(form.category_id),
                thumbnail: form.thumbnail?.trim() || undefined,
                preview_video: form.preview_video?.trim() || undefined,
                price: form.price === "" ? 0 : Number(form.price),
                level: form.level || 'beginner',
                language: form.language?.trim() || 'English',
                status: form.status || 'draft',
                is_featured: Boolean(form.is_featured),
                requirements: form.requirements?.trim() || undefined,
                what_you_learn: form.what_you_learn?.trim() || undefined,
                certificate_eligible: Number(form.certificate_eligible) || 0
            };

            if (editCourse) {
                await courseService.update(editCourse.id, payload);
                toast.success("Course updated successfully!");
            } else {
                await courseService.create(payload);
                toast.success("Course created successfully!");
            }
            setShowModal(false);
            loadCourses();
        } catch (err) {
            console.error("Course Save Error:", err);
            console.error("Error Response:", err.response);
            
            // Handle Different Error Types
            if (err.response?.status === 422) {
                // Validation Error - Show Specific Field Errors
                const errors = err.response?.data?.errors;
                if (errors && typeof errors === 'object') {
                    // Show first validation error
                    const firstError = Object.values(errors)[0];
                    toast.error(`Validation Error: ${Array.isArray(firstError) ? firstError[0] : firstError}`);
                } else {
                    toast.error(err.response?.data?.message || "Validation failed. Please check all fields.");
                }
            } else if (err.response?.status === 409) {
                // Conflict Error - Slug already exists
                toast.error("Course with this title/slug already exists. Please use a different title.");
            } else if (err.response?.status === 400) {
                // Bad Request - Category not found or other business logic error
                toast.error(err.response?.data?.message || "Invalid data provided. Please check your inputs.");
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                // Authentication/Authorization Error
                toast.error("You are not authorized to perform this action. Please login again.");
            } else if (err.response?.status >= 500) {
                // Server Error
                toast.error("Server error occurred. Please try again later.");
            } else {
                // Network Error or Other
                toast.error(err.response?.data?.message || "Failed to save course. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (course) => {
        setDeleting(course.id);
        try {
            await courseService.delete(course.id);
            toast.success("Course deleted!");
            loadCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setDeleting(null);
        }
    };

    const handleToggleFeatured = async (course) => {
        try {
            // Fix: Send boolean instead of number
            const newFeatured = !course.is_featured;
            await courseService.update(course.id, { is_featured: newFeatured });
            toast.success(`Course ${newFeatured ? 'featured' : 'unfeatured'} successfully!`);
            loadCourses();
        } catch (err) {
            console.error("Toggle Featured Error:", err);
            toast.error(err.response?.data?.message || "Failed to update featured status");
        }
    };

    const handleStatusChange = async (course, newStatus) => {
        try {
            await courseService.update(course.id, { status: newStatus });
            
            // Show appropriate success message
            const statusMessages = {
                draft: "Course moved to draft successfully!",
                published: "Course published successfully!",
                archived: "Course archived successfully!"
            };
            
            toast.success(statusMessages[newStatus] || `Course status updated to ${newStatus}!`);
            loadCourses();
        } catch (err) {
            console.error("Status Change Error:", err);
            toast.error(err.response?.data?.message || "Failed to update course status");
        }
    };

    // Helper function to get next status options
    const getStatusOptions = (currentStatus) => {
        const options = [];
        
        if (currentStatus === 'published') {
            options.push({ value: 'draft', label: 'Unpublish', icon: '📝', color: 'warning', description: 'Make course invisible to students' });
            options.push({ value: 'archived', label: 'Archive', icon: '📦', color: 'danger', description: 'Archive course (won\'t be visible)' });
        } else if (currentStatus === 'draft') {
            options.push({ value: 'published', label: 'Publish', icon: '✅', color: 'success', description: 'Make course visible to students' });
            options.push({ value: 'archived', label: 'Archive', icon: '📦', color: 'danger', description: 'Archive course (won\'t be visible)' });
        } else if (currentStatus === 'archived') {
            options.push({ value: 'draft', label: 'Restore', icon: '🔄', color: 'primary', description: 'Restore to draft status' });
        }
        
        return options;
    };

    // Status popup handlers
    const openStatusModal = (course) => {
        setSelectedCourse(course);
        setShowStatusModal(true);
    };

    const closeStatusModal = () => {
        setShowStatusModal(false);
        setSelectedCourse(null);
    };

    const handleStatusSelect = (newStatus) => {
        if (selectedCourse) {
            handleStatusChange(selectedCourse, newStatus);
            closeStatusModal();
        }
    };

    // ── Field helper ──────────────────────────────────────────────────────────
    const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

    return (
        <div className="space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                        Dashboard › <span className="text-[#3282B8]">Courses</span>
                    </p>
                    <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Courses</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage your course catalog and content</p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                        <Download size={15} /> Export
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                        style={{ background: "#3282B8" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#2a6fa0"}
                        onMouseLeave={e => e.currentTarget.style.background = "#3282B8"}
                    >
                        <Plus size={16} /> Create Course
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Courses",   value: stats.total,     sub: "+12% from last month",  subColor: "text-green-600",  icon: BookOpen,      ibg: "#EBF4FF", ic: "#3282B8"  },
                    { label: "Published",        value: stats.published, sub: "Active in catalog",     subColor: "text-green-600",  icon: CheckCircle2,  ibg: "#F0FDF4", ic: "#22C55E"  },
                    { label: "Draft",            value: stats.draft,     sub: "Ready to review",       subColor: "text-yellow-600", icon: Edit2,         ibg: "#FFFBEB", ic: "#F59E0B"  },
                    { label: "Total Enrolled",   value: fmt(stats.enrolled), sub: "Active learners",   subColor: "text-purple-600", icon: Users,         ibg: "#F5F3FF", ic: "#8B5CF6"  },
                ].map(({ label, value, sub, subColor, icon: Icon, ibg, ic }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5"
                        style={{ boxShadow: "0 1px 8px rgba(15,23,42,0.05)" }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
                                <p className="text-[30px] font-extrabold text-slate-900 leading-none">{value}</p>
                                <p className={`text-xs font-medium mt-1.5 ${subColor}`}>{sub}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: ibg }}>
                                <Icon size={18} style={{ color: ic }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Search + Filters ── */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4"
                style={{ boxShadow: "0 1px 8px rgba(15,23,42,0.05)" }}>
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by course title, instructor..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 outline-none focus:border-[#3282B8] focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {/* Status */}
                        <select value={status} onChange={e => setStatus(e.target.value)}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-[#3282B8] cursor-pointer">
                            <option value="">All Status</option>
                            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        {/* Level */}
                        <select value={level} onChange={e => setLevel(e.target.value)}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-[#3282B8] cursor-pointer">
                            <option value="">All Levels</option>
                            {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                        </select>
                        {/* Category - Nested Parent/Child Selection */}
                        <div className="flex gap-2">
                            {/* Parent Category Dropdown */}
                            <select 
                                value={selectedParent} 
                                onChange={e => handleParentCategoryChange(e.target.value)}
                                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-[#3282B8] cursor-pointer"
                            >
                                <option value="">Select Parent Category</option>
                                {categories.filter(c => !c.parent_id).map(parent => (
                                    <option key={parent.id} value={parent.id}>
                                        {parent.name}
                                    </option>
                                ))}
                            </select>
                            
                            {/* Child Category Dropdown - Only show if parent has children */}
                            {selectedParent && getChildCategories(selectedParent).length > 0 && (
                                <select 
                                    value={catId} 
                                    onChange={e => handleChildCategoryChange(e.target.value)}
                                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-[#3282B8] cursor-pointer"
                                >
                                    <option value="">Select Sub-Category</option>
                                    {getChildCategories(selectedParent).map(child => (
                                        <option key={child.id} value={child.id}>
                                            {child.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                style={{ boxShadow: "0 1px 8px rgba(15,23,42,0.05)" }}>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={28} className="animate-spin text-[#3282B8]" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <AlertCircle size={28} className="text-red-500" />
                        <p className="text-sm font-medium text-red-600">{error}</p>
                        <button onClick={loadCourses}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                            style={{ background: "#3282B8" }}>
                            Retry
                        </button>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <BookOpen size={32} className="text-slate-300" />
                        <p className="text-sm font-medium text-slate-500">No courses found</p>
                        <button onClick={openCreate}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                            style={{ background: "#3282B8" }}>
                            Create First Course
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    {["COURSE", "INSTRUCTOR", "LEVEL", "PRICE", "STUDENTS", "STATUS", "FEATURED", "ACTIONS"].map(h => (
                                        <th key={h} className="text-left py-3 px-4 text-[10.5px] font-bold text-slate-400 tracking-widest uppercase whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {courses.map(course => {
                                    const s = STATUS_STYLE[course.status] ?? STATUS_STYLE.draft;
                                    return (
                                        <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                                            {/* Course */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                                                        {course.thumbnail
                                                            ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                            : <BookOpen size={16} className="text-slate-400" />
                                                        }
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[13.5px] font-bold text-slate-900 truncate max-w-[200px]">
                                                            {course.title}
                                                        </p>
                                                        <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5"
                                                            style={{ color: "#3282B8" }}>
                                                            {course.category_name ?? "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Instructor */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600 shrink-0">
                                                        {(course.instructor_name ?? "?").charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-[13px] text-slate-700 whitespace-nowrap">
                                                        {course.instructor_name ?? "—"}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Level */}
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ${LEVEL_STYLE[course.level] ?? "bg-gray-100 text-gray-600"}`}>
                                                    {course.level ?? "—"}
                                                </span>
                                            </td>
                                            {/* Price */}
                                            <td className="py-3.5 px-4 text-[13.5px] font-bold text-slate-800 whitespace-nowrap">
                                                {fmtPrice(course.price)}
                                            </td>
                                            {/* Students */}
                                            <td className="py-3.5 px-4 text-[13.5px] text-slate-700">
                                                {(course.enrolled_count ?? 0).toLocaleString()}
                                            </td>
                                            {/* Status */}
                                            <td className="py-3.5 px-4">
                                                <button 
                                                    onClick={() => openStatusModal(course)}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-opacity hover:opacity-75 ${s.bg} ${s.text}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                                    {s.label}
                                                    <ChevronRight size={12} className="ml-1 opacity-50" />
                                                </button>
                                            </td>
                                            {/* Featured */}
                                            <td className="py-3.5 px-4">
                                                <button onClick={() => handleToggleFeatured(course)}
                                                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                                                    <Star size={16}
                                                        className={course.is_featured ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}
                                                    />
                                                </button>
                                            </td>
                                            {/* Actions */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => openEdit(course)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:bg-[#EBF4FF] hover:text-[#3282B8] transition-colors"
                                                        title="Edit">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course)}
                                                        disabled={deleting === course.id}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                                        title="Delete">
                                                        {deleting === course.id
                                                            ? <Loader2 size={14} className="animate-spin" />
                                                            : <Trash2 size={14} />
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                        <p className="text-[13px] text-slate-500">
                            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, totalCount)} of {totalCount} results
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                                <ChevronLeft size={14} />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const p = i + 1;
                                return (
                                    <button key={p} onClick={() => setPage(p)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors",
                                            page === p
                                                ? "text-white"
                                                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                        style={page === p ? { background: "#3282B8" } : {}}>
                                        {p}
                                    </button>
                                );
                            })}
                            {totalPages > 5 && <span className="text-slate-400 text-sm">...</span>}
                            {totalPages > 5 && (
                                <button onClick={() => setPage(totalPages)}
                                    className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors",
                                        page === totalPages ? "text-white" : ""
                                    )}
                                    style={page === totalPages ? { background: "#3282B8" } : {}}>
                                    {totalPages}
                                </button>
                            )}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Create / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">

                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-[17px] font-extrabold text-slate-900">
                                    {editCourse ? "Edit Course" : "Create Course"}
                                </h2>
                                <p className="text-[12.5px] text-slate-500 mt-0.5">
                                    {editCourse ? "Update course details" : "Fill in the details to create a new course"}
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <form onSubmit={handleSave} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

                            {/* Title + Category */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="TITLE *">
                                    <input type="text" required value={form.title}
                                        onChange={e => setF("title", e.target.value)}
                                        className={inputCls} placeholder="Course title" />
                                </Field>
                                <Field label="CATEGORY *">
                                    <div className="space-y-2">
                                        {/* Parent Category Dropdown */}
                                        <select 
                                            required 
                                            value={formParent} 
                                            onChange={e => handleFormParentChange(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-[#3282B8] cursor-pointer"
                                        >
                                            <option value="">Select Parent Category</option>
                                            {categories.filter(c => !c.parent_id).map(parent => (
                                                <option key={parent.id} value={parent.id}>
                                                    {parent.name}
                                                </option>
                                            ))}
                                        </select>
                                        
                                        {/* Child Category Dropdown - Only show if parent has children */}
                                        {formParent && getChildCategories(formParent).length > 0 && (
                                            <select 
                                                required 
                                                value={formChild} 
                                                onChange={e => handleFormChildChange(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-[#3282B8] cursor-pointer"
                                            >
                                                <option value="">Select Sub-Category</option>
                                                {getChildCategories(formParent).map(child => (
                                                    <option key={child.id} value={child.id}>
                                                        {child.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {/* Show selected category info */}
                                        {getFormSelectedCategory() && (
                                            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                                                Selected: {getFormSelectedCategory().name}
                                                {!formChild && formParent && " (Parent Category)"}
                                                {formChild && " (Sub-Category)"}
                                            </div>
                                        )}
                                    </div>
                                </Field>
                            </div>

                            {/* Slug */}
                            <Field label="SLUG">
                                <input type="text" value={form.slug}
                                    onChange={e => setF("slug", e.target.value)}
                                    className={inputCls} placeholder="auto-generated-if-empty" />
                            </Field>

                            {/* Short desc */}
                            <Field label="SHORT DESCRIPTION">
                                <textarea value={form.short_desc} rows={2}
                                    onChange={e => setF("short_desc", e.target.value)}
                                    className={inputCls} placeholder="Brief description (max 500 chars)"
                                    maxLength={500} />
                            </Field>

                            {/* Description */}
                            <Field label="DESCRIPTION">
                                <textarea value={form.description} rows={3}
                                    onChange={e => setF("description", e.target.value)}
                                    className={inputCls} placeholder="Full course description" />
                            </Field>

                            {/* Thumbnail + Preview video */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="THUMBNAIL URL">
                                    <input type="url" value={form.thumbnail}
                                        onChange={e => setF("thumbnail", e.target.value)}
                                        className={inputCls} placeholder="https://..." />
                                </Field>
                                <Field label="PREVIEW VIDEO URL">
                                    <input type="url" value={form.preview_video}
                                        onChange={e => setF("preview_video", e.target.value)}
                                        className={inputCls} placeholder="https://..." />
                                </Field>
                            </div>

                            {/* Price + Level + Language + Status */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <Field label="PRICE (₹)">
                                    <input type="number" min={0} value={form.price}
                                        onChange={e => setF("price", e.target.value)}
                                        className={inputCls} placeholder="0" />
                                </Field>
                                <Field label="LEVEL">
                                    <select value={form.level} onChange={e => setF("level", e.target.value)} className={inputCls}>
                                        {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                                    </select>
                                </Field>
                                <Field label="LANGUAGE">
                                    <input type="text" value={form.language}
                                        onChange={e => setF("language", e.target.value)}
                                        className={inputCls} placeholder="English" />
                                </Field>
                                <Field label="STATUS">
                                    <select value={form.status} onChange={e => setF("status", e.target.value)} className={inputCls}>
                                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </Field>
                            </div>

                            {/* Requirements + What you learn */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="REQUIREMENTS">
                                    <textarea value={form.requirements} rows={2}
                                        onChange={e => setF("requirements", e.target.value)}
                                        className={inputCls} placeholder="Course requirements..." />
                                </Field>
                                <Field label="WHAT YOU'LL LEARN">
                                    <textarea value={form.what_you_learn} rows={2}
                                        onChange={e => setF("what_you_learn", e.target.value)}
                                        className={inputCls} placeholder="Learning outcomes..." />
                                </Field>
                            </div>

                            {/* Toggles */}
                            <div className="flex gap-6">
                                <Toggle
                                    label="Featured Course"
                                    checked={form.is_featured}
                                    onChange={v => setF("is_featured", v)}
                                />
                                <Toggle
                                    label="Certificate Eligible"
                                    checked={!!form.certificate_eligible}
                                    onChange={v => setF("certificate_eligible", v ? 1 : 0)}
                                />
                            </div>
                        </form>

                        {/* Modal footer */}
                        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
                            <button type="button" onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-60 transition-colors"
                                style={{ background: "#3282B8" }}
                                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#2a6fa0"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#3282B8"; }}>
                                {saving
                                    ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                                    : <><Save size={14} />{editCourse ? "Update Course" : "Create Course"}</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

        {/* Status Change Popup Modal */}
        {showStatusModal && selectedCourse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Change Course Status
                        </h3>
                        <button
                            onClick={closeStatusModal}
                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="px-6 py-4">
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Course:</p>
                            <p className="font-medium text-gray-900">{selectedCourse.title}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">Select new status:</p>
                            <div className="space-y-2">
                                {getStatusOptions(selectedCourse.status).map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleStatusSelect(option.value)}
                                        className={`w-full p-3 rounded-lg border text-left flex items-start gap-3 transition-colors hover:bg-gray-50
                                            ${option.color === 'success' ? 'border-green-200 hover:border-green-300' : ''}
                                            ${option.color === 'warning' ? 'border-yellow-200 hover:border-yellow-300' : ''}
                                            ${option.color === 'danger' ? 'border-red-200 hover:border-red-300' : ''}
                                            ${option.color === 'primary' ? 'border-blue-200 hover:border-blue-300' : ''}
                                        `}
                                    >
                                        <span className="text-lg">{option.icon}</span>
                                        <div className="flex-1">
                                            <p className={`font-medium text-sm
                                                ${option.color === 'success' ? 'text-green-700' : ''}
                                                ${option.color === 'warning' ? 'text-yellow-700' : ''}
                                                ${option.color === 'danger' ? 'text-red-700' : ''}
                                                ${option.color === 'primary' ? 'text-blue-700' : ''}
                                            `}>
                                                {option.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
                        <button
                            onClick={closeStatusModal}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
)
}

// ─── Shared ───────────────────────────────────────────────────────────────────

const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13.5px] text-slate-800 outline-none focus:border-[#3282B8] focus:bg-white transition-colors";

function Field({ label, children }) {
    return (
        <div>
            <label className="text-[13px] font-semibold text-slate-700 uppercase tracking-wider">
                {label}
            </label>
            {children}
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
                onClick={() => onChange(!checked)}
                className={cn(
                    "w-10 h-5 rounded-full relative transition-colors duration-200",
                    checked ? "bg-[#3282B8]" : "bg-slate-200"
                )}
            >
                <div className={cn(
                    "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                    checked ? "left-5" : "left-0.5"
                )} />
            </div>
            <span className="text-[13px] font-medium text-slate-700">{label}</span>
        </label>
    );
}