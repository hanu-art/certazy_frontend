import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import {
    fetchCourses,
    setFilter,
    setPage,
    selectCourses,
    selectPagination,
    selectFilters,
    selectCoursesLoading,
    selectCoursesError,
} from "@/features/course/courseSlice";

import categoryService from "@/services/categoryService";
import CourseCard from "./CourseCard";
import CourseFilters from "./CourseFilters";
import CourseSortBar from "./CourseSortBar";
import { CourseCardSkeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";

/**
 * CoursesPage — index.jsx
 *
 * Layout:
 *   1. Hero banner — dark blue, heading + search
 *   2. Filters sidebar + Sort bar + Course grid + Pagination
 *
 * URL params:
 *   ?category=amazon-aws
 *   ?search=AWS
 *   ?level=beginner
 *   ?page=2
 */
export default function CoursesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const courses = useSelector(selectCourses);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);
    const loading = useSelector(selectCoursesLoading);
    const error = useSelector(selectCoursesError);

    const [categories, setCategories] = useState([]);
    const [heroSearch, setHeroSearch] = useState("");

    // ── Sync URL params → Redux on mount ──────────────────
    useEffect(() => {
        const category_id = searchParams.get("category_id");
        const search = searchParams.get("search");
        const level = searchParams.get("level");

        if (category_id) dispatch(setFilter({ key: "category_id", value: Number(category_id) }));
        if (search) dispatch(setFilter({ key: "search", value: search }));
        if (level) dispatch(setFilter({ key: "level", value: level }));
    }, []);

    // ── Fetch categories for sidebar ──────────────────────
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await categoryService.getAll();
                setCategories(data.data.categories);
            } catch {
                // silent fail
            }
        };
        fetchCategories();
    }, []);

    // ── Fetch courses when filters or page change ─────────
    useEffect(() => {
        const params = {
            page: pagination.page,
            limit: pagination.limit,
        };

        if (filters.category_id) params.category_id = filters.category_id;
        if (filters.level) params.level = filters.level;
        if (filters.search) params.search = filters.search;
        if (filters.sort) params.sort = filters.sort;

        dispatch(fetchCourses(params));
    }, [
        filters.category_id,
        filters.level,
        filters.search,
        filters.sort,
        pagination.page,
    ]);

    // ── Hero search submit ─────────────────────────────────
    const handleHeroSearch = (e) => {
        e.preventDefault();
        if (!heroSearch.trim()) return;
        dispatch(setFilter({ key: "search", value: heroSearch.trim() }));
        setHeroSearch("");
        // Scroll to courses section
        document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div
            className="min-h-screen"
            style={{ background: "linear-gradient(180deg, #EBF4FB 0%, #F8F9FA 100%)" }}
        >

            {/* ── Hero Banner ── */}
            <div
                className="w-full"
                style={{ background: "linear-gradient(135deg, #0a2540 0%, #1a3a6c 60%, #1e4d8c 100%)" }}
            >
                <div className="max-w-[1280px] mx-auto px-6 py-14">
                    <div className="max-w-[600px]">

                        {/* Heading */}
                        <h1 className="text-[32px] font-extrabold text-white leading-tight mb-2 tracking-tight">
                            Master the Art of
                        </h1>
                        <h1 className="text-[32px] font-extrabold leading-tight mb-4 tracking-tight"
                            style={{ color: "#5eb8ff" }}
                        >
                            Certification Success.
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[15px] text-white/70 mb-8 leading-relaxed">
                            Industry-recognized certification courses to accelerate your career.
                        </p>

                        {/* Search bar */}
                        <form onSubmit={handleHeroSearch}>
                            <div className="flex items-center gap-0 bg-white rounded-lg overflow-hidden"
                                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
                            >
                                <div className="flex items-center gap-2 flex-1 px-4">
                                    <Search size={16} className="text-text-muted shrink-0" />
                                    <input
                                        type="text"
                                        value={heroSearch}
                                        onChange={(e) => setHeroSearch(e.target.value)}
                                        placeholder="What do you want to learn?"
                                        className="flex-1 py-3.5 text-[14px] text-text-primary placeholder:text-text-muted outline-none bg-transparent font-sans"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="h-full px-6 py-3.5 font-semibold text-[14px] text-white transition-colors duration-200 shrink-0"
                                    style={{ background: "#3282B8" }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#2a6fa0"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "#3282B8"}
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── Courses Section ── */}
            <div
                id="courses-section"
                className="max-w-[1280px] mx-auto px-6 py-8"
            >

                {/* Active search indicator */}
                {filters.search && (
                    <div className="mb-4 flex items-center gap-2">
                        <p className="text-[14px] text-text-secondary">
                            Showing results for{" "}
                            <span className="font-semibold text-text-primary">
                                "{filters.search}"
                            </span>
                        </p>
                        <button
                            onClick={() => dispatch(setFilter({ key: "search", value: null }))}
                            className="text-[12.5px] font-medium text-primary hover:text-primary-hover transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                )}

                {/* Main layout */}
                <div className="flex gap-6 items-start">

                    {/* Sidebar */}
                    <CourseFilters categories={categories} />

                    {/* Right side */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* Sort bar */}
                        <CourseSortBar />

                        {/* Error */}
                        {error && !loading && (
                            <div className="bg-white rounded-lg p-8 text-center"
                                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                            >
                                <p className="text-[13.5px] text-red-500 mb-2">{error}</p>
                                <button
                                    onClick={() => dispatch(fetchCourses({}))}
                                    className="text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Courses grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loading
                                ? Array(pagination.limit).fill(0).map((_, i) => (
                                    <CourseCardSkeleton key={i} />
                                ))
                                : courses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))
                            }
                        </div>

                        {/* Empty state */}
                        {!loading && !error && courses.length === 0 && (
                            <div className="bg-white rounded-lg p-12 text-center"
                                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                            >
                                <p className="text-[15px] font-semibold text-text-primary mb-2">
                                    No courses found
                                </p>
                                <p className="text-[13px] text-text-muted">
                                    Try adjusting your filters or search query
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && pagination.totalPages > 1 && (
                            <Pagination
                                pagination={pagination}
                                onPageChange={(page) => {
                                    dispatch(setPage(page));
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Pagination ────────────────────────────────────────────
function Pagination({ pagination, onPageChange }) {
    const { page, totalPages } = pagination;

    const getPages = () => {
        const pages = [];
        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, start + 4);
        if (end - start < 4) start = Math.max(1, end - 4);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 pt-2">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className={cn(
                    "w-9 h-9 rounded flex items-center justify-center border border-border transition-colors",
                    page === 1
                        ? "text-text-muted cursor-not-allowed bg-page"
                        : "bg-white text-text-secondary hover:border-primary hover:text-primary"
                )}
            >
                <ChevronLeft size={16} />
            </button>

            {getPages().map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={cn(
                        "w-9 h-9 rounded text-[13px] font-semibold transition-colors",
                        p === page
                            ? "bg-primary text-white"
                            : "bg-white border border-border text-text-secondary hover:border-primary hover:text-primary"
                    )}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className={cn(
                    "w-9 h-9 rounded flex items-center justify-center border border-border transition-colors",
                    page === totalPages
                        ? "text-text-muted cursor-not-allowed bg-page"
                        : "bg-white text-text-secondary hover:border-primary hover:text-primary"
                )}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}