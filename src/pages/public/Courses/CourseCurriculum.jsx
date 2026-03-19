import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, PlayCircle, FileText, HelpCircle, Lock, Eye } from "lucide-react";
import lessonService from "@/services/lessonService";
import { cn } from "@/lib/utils";

/**
 * CourseCurriculum.jsx
 *
 * Displays course sections + lessons in accordion style.
 * Lessons are fetched per section when expanded.
 *
 * Props:
 *   sections  → [ { id, title, order_num } ]
 *   courseId  → number
 *   isEnrolled → boolean — shows lock/unlock state
 */

// Duration — seconds to readable format
function formatDuration(seconds) {
    if (!seconds) return null;
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return h > 0 ? `${h}h ${rem > 0 ? `${rem}m` : ""}`.trim() : `${m}m`;
}

// Lesson type icon
function LessonIcon({ type, isFree, isEnrolled }) {
    const locked = !isFree && !isEnrolled;

    if (locked) {
        return <Lock size={14} className="text-text-muted shrink-0" />;
    }

    const icons = {
        video: <PlayCircle size={14} className="text-primary shrink-0" />,
        article: <FileText size={14} className="text-green-600 shrink-0" />,
        quiz: <HelpCircle size={14} className="text-orange-500 shrink-0" />,
    };

    return icons[type] || icons.video;
}

// ── Single lesson row ─────────────────────────────────────
function LessonRow({ lesson, isEnrolled }) {
    const isLocked = !lesson.is_free && !isEnrolled;
    const duration = formatDuration(lesson.duration);

    return (
        <div className={cn(
            "flex items-center gap-3 px-4 py-2.5",
            "border-b border-border last:border-0",
            isLocked ? "opacity-70" : "cursor-pointer hover:bg-primary-light transition-colors duration-150"
        )}>
            {/* Icon */}
            <LessonIcon type={lesson.type} isFree={lesson.is_free} isEnrolled={isEnrolled} />

            {/* Title */}
            <span className={cn(
                "flex-1 text-[13px]",
                isLocked ? "text-text-muted" : "text-text-primary font-medium"
            )}>
                {lesson.title}
            </span>

            {/* Free preview badge */}
            {lesson.is_free === 1 && !isEnrolled && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full shrink-0">
                    <Eye size={10} />
                    Preview
                </span>
            )}

            {/* Duration */}
            {duration && (
                <span className="text-[11.5px] text-text-muted shrink-0">
                    {duration}
                </span>
            )}
        </div>
    );
}

// ── Single section ────────────────────────────────────────
function SectionRow({ section, index, isEnrolled }) {
    const [open, setOpen] = useState(index === 0); // first section open by default
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch lessons when section is expanded
    useEffect(() => {
        if (!open || lessons.length > 0) return;

        const fetchLessons = async () => {
            try {
                setLoading(true);
                const { data } = await lessonService.getBySectionId(section.id);
                setLessons(data.data.lessons);
            } catch {
                // silent fail
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [open]);

    // Total duration of section
    const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            {/* Section header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-4 px-4 py-3.5 bg-page hover:bg-border/30 transition-colors duration-150 text-left"
            >
                {/* Number */}
                <span className="text-[13px] font-bold text-primary w-6 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                </span>

                {/* Title */}
                <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-text-primary truncate">
                        {section.title}
                    </p>
                    <p className="text-[11.5px] text-text-muted mt-0.5">
                        {lessons.length > 0
                            ? `${lessons.length} lessons${totalDuration ? ` • ${formatDuration(totalDuration)}` : ""}`
                            : "Loading..."
                        }
                    </p>
                </div>

                {/* Chevron */}
                {open
                    ? <ChevronUp size={16} className="text-text-muted shrink-0" />
                    : <ChevronDown size={16} className="text-text-muted shrink-0" />
                }
            </button>

            {/* Lessons list */}
            {open && (
                <div className="bg-white">
                    {loading ? (
                        <div className="px-4 py-4 text-[13px] text-text-muted">
                            Loading lessons...
                        </div>
                    ) : lessons.length > 0 ? (
                        lessons.map((lesson) => (
                            <LessonRow
                                key={lesson.id}
                                lesson={lesson}
                                isEnrolled={isEnrolled}
                            />
                        ))
                    ) : (
                        <div className="px-4 py-4 text-[13px] text-text-muted italic">
                            No lessons yet
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main component ────────────────────────────────────────
export default function CourseCurriculum({ sections = [], courseId, isEnrolled = false }) {
    if (sections.length === 0) {
        return (
            <div className="text-[13px] text-text-muted italic py-4">
                Curriculum not available yet.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {sections.map((section, index) => (
                <SectionRow
                    key={section.id}
                    section={section}
                    index={index}
                    isEnrolled={isEnrolled}
                />
            ))}
        </div>
    );
}