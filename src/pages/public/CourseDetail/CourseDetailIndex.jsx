import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Star, Users, BookOpen, Award,
    ChevronRight, CheckCircle, Clock
} from "lucide-react";

import courseService from "@/services/courseService";
import sectionService from "@/services/sectionService";
import { selectIsLoggedIn } from "@/features/auth/authSlice";

import CourseCurriculum from "./CourseCurriculum";
import CourseEnrollCard from "./CourseEnrollCard";
import { cn } from "@/lib/utils";

/**
 * CourseDetailPage — index.jsx
 * Route: /courses/:slug
 */
export default function CourseDetailIndex() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isEnrolled = false;

    // ── Fetch course + sections ──────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: cd } = await courseService.getBySlug(slug);
                const course = cd.data.course;
                setCourse(course);

                const { data: sd } = await sectionService.getByCourseId(course.id);
                setSections(sd.data.sections);
            } catch (err) {
                setError(err.response?.data?.message || "Course not found");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleEnroll = () => {
        if (!isLoggedIn) { navigate("/login"); return; }
        navigate(`/checkout?course=${course.id}`);
    };

    if (loading) return <CourseDetailSkeleton />;

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: "linear-gradient(180deg, #EBF4FB 0%, #F8F9FA 100%)" }}>
                <div className="text-center">
                    <p className="text-[16px] font-semibold text-text-primary mb-3">{error}</p>
                    <button onClick={() => navigate("/courses")}
                        className="text-[14px] font-medium text-primary hover:text-primary-hover transition-colors">
                        ← Back to courses
                    </button>
                </div>
            </div>
        );
    }

    // Parse what_you_learn — newline separated string
    const whatYouLearn = course.what_you_learn
        ? course.what_you_learn.split("\n").filter(Boolean)
        : [];

    return (
        <div className="min-h-screen"
            style={{ background: "linear-gradient(180deg, #EBF4FB 0%, #F8F9FA 100%)" }}>

            {/* ── Hero Banner ── */}
            <div style={{ background: "linear-gradient(135deg, #0a2540 0%, #1a3a6c 60%, #1e4d8c 100%)" }}>
                <div className="max-w-[1280px] mx-auto px-6 py-14">
                    <div className="max-w-[720px]">

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1.5 text-[12px] mb-5 flex-wrap"
                            style={{ color: "rgba(255,255,255,0.45)" }}>
                            <span className="hover:text-white cursor-pointer transition-colors"
                                onClick={() => navigate("/courses")}>
                                Courses
                            </span>
                            <ChevronRight size={11} />
                            <span className="hover:text-white cursor-pointer transition-colors"
                                onClick={() => navigate(`/courses?category_id=${course.category_id}`)}>
                                {course.category_name}
                            </span>
                            <ChevronRight size={11} />
                            <span style={{ color: "rgba(255,255,255,0.65)" }} className="truncate max-w-[300px]">
                                {course.title}
                            </span>
                        </div>

                        {/* Category badge */}
                        <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider mb-5 px-3 py-1.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.12)", color: "#5eb8ff" }}>
                            {course.category_name}
                        </span>

                        {/* Title */}
                        <h1 className="text-[30px] font-extrabold text-white leading-tight mb-4 tracking-tight">
                            {course.title}
                        </h1>

                        {/* Short desc */}
                        {course.short_desc && (
                            <p className="text-[15px] mb-6 leading-relaxed max-w-[600px]"
                                style={{ color: "rgba(255,255,255,0.72)" }}>
                                {course.short_desc}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-5 flex-wrap">
                            {/* Rating */}
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                    {Array(5).fill(0).map((_, i) => (
                                        <Star key={i} size={13}
                                            className={cn(
                                                i < Math.round(course.rating_avg || 0)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-white/20 fill-white/20"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-[13px] font-semibold text-white">
                                    {course.rating_avg > 0 ? Number(course.rating_avg).toFixed(1) : "New"}
                                </span>
                                {course.rating_count > 0 && (
                                    <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                                        ({course.rating_count})
                                    </span>
                                )}
                            </div>

                            {course.enrolled_count > 0 && (
                                <div className="flex items-center gap-1.5"
                                    style={{ color: "rgba(255,255,255,0.65)" }}>
                                    <Users size={13} />
                                    <span className="text-[13px]">
                                        {course.enrolled_count.toLocaleString()} students
                                    </span>
                                </div>
                            )}

                            {sections.length > 0 && (
                                <div className="flex items-center gap-1.5"
                                    style={{ color: "rgba(255,255,255,0.65)" }}>
                                    <BookOpen size={13} />
                                    <span className="text-[13px]">{sections.length} sections</span>
                                </div>
                            )}

                            {course.certificate_eligible === 1 && (
                                <div className="flex items-center gap-1.5"
                                    style={{ color: "rgba(255,255,255,0.65)" }}>
                                    <Award size={13} />
                                    <span className="text-[13px]">Certificate</span>
                                </div>
                            )}
                        </div>

                        {/* Instructor */}
                        {course.instructor_name && (
                            <div className="flex items-center gap-2 mt-5">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                                    style={{ background: "rgba(255,255,255,0.15)" }}>
                                    {course.instructor_name.charAt(0).toUpperCase()}
                                </div>
                                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                                    Instructor:{" "}
                                    <span className="text-white font-semibold">
                                        {course.instructor_name}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-[1280px] mx-auto px-6 py-8">
                <div className="flex gap-8 items-start">

                    {/* Left */}
                    <div className="flex-1 min-w-0 space-y-5">

                        {/* What you'll learn */}
                        {whatYouLearn.length > 0 && (
                            <SectionCard title="What You'll Learn">
                                <div className="grid grid-cols-2 gap-3">
                                    {whatYouLearn.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckCircle size={15} className="text-primary shrink-0 mt-0.5" />
                                            <span className="text-[13.5px] text-text-secondary leading-relaxed">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}

                        {/* About */}
                        {course.description && (
                            <SectionCard title="About this Course">
                                <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-line">
                                    {course.description}
                                </p>
                            </SectionCard>
                        )}

                        {/* Curriculum */}
                        <SectionCard title="Curriculum">
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                <span className="text-[13px] text-text-muted">
                                    {sections.length} sections
                                </span>
                                {course.total_lessons > 0 && (
                                    <>
                                        <span className="text-text-muted">•</span>
                                        <span className="text-[13px] text-text-muted">
                                            {course.total_lessons} lessons
                                        </span>
                                    </>
                                )}
                            </div>
                            <CourseCurriculum
                                sections={sections}
                                courseId={course.id}
                                isEnrolled={isEnrolled}
                            />
                        </SectionCard>

                        {/* Course Details */}
                        <SectionCard title="Course Details">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Level", value: course.level, capitalize: true },
                                    { label: "Language", value: course.language },
                                    { label: "Category", value: course.category_name },
                                    { label: "Certificate", value: course.certificate_eligible === 1 ? "Included" : "Not included" },
                                ].map((item) => (
                                    <div key={item.label}
                                        className="flex items-center gap-3 bg-page rounded-lg px-4 py-3">
                                        <div>
                                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-0.5">
                                                {item.label}
                                            </p>
                                            <p className={cn(
                                                "text-[13.5px] font-semibold text-text-primary",
                                                item.capitalize && "capitalize"
                                            )}>
                                                {item.value || "—"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>

                    {/* Right — sticky enroll card */}
                    <div className="w-[320px] shrink-0">
                        <CourseEnrollCard
                            course={course}
                            isEnrolled={isEnrolled}
                            onEnroll={handleEnroll}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Section card wrapper ──────────────────────────────────
function SectionCard({ title, children }) {
    return (
        <div className="bg-white rounded-lg p-6"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2.5 mb-5">
                <div className="w-[3px] h-5 bg-primary rounded-full shrink-0" />
                <h2 className="text-[16px] font-bold text-text-primary">
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────
function CourseDetailSkeleton() {
    return (
        <div className="min-h-screen"
            style={{ background: "linear-gradient(180deg, #EBF4FB 0%, #F8F9FA 100%)" }}>
            <div style={{ background: "linear-gradient(135deg, #0a2540 0%, #1a3a6c 100%)" }}
                className="h-[260px] animate-pulse" />
            <div className="max-w-[1280px] mx-auto px-6 py-8">
                <div className="flex gap-8">
                    <div className="flex-1 space-y-5">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-lg p-6 animate-pulse"
                                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                                <div className="h-4 bg-border rounded w-36 mb-5" />
                                <div className="space-y-2.5">
                                    <div className="h-3 bg-border rounded w-full" />
                                    <div className="h-3 bg-border rounded w-4/5" />
                                    <div className="h-3 bg-border rounded w-3/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-[320px] shrink-0">
                        <div className="bg-white rounded-lg h-[420px] animate-pulse"
                            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }} />
                    </div>
                </div>
            </div>
        </div>
    );
}