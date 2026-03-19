import { useState, useEffect } from "react";
import {
    ChevronDown, ChevronUp,
    PlayCircle, FileText, HelpCircle,
    Lock, Eye
} from "lucide-react";
import lessonService from "@/services/lessonService";
import { cn } from "@/lib/utils";

/**
 * CourseCurriculum.jsx
 * Premium accordion — sections + lazy-loaded lessons
 */

function formatDuration(seconds) {
    if (!seconds) return null;
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return h > 0 ? `${h}h ${rem > 0 ? `${rem}m` : ""}`.trim() : `${m}m`;
}

// ── Lesson type icon ──────────────────────────────────────
function LessonIcon({ type, isLocked }) {
    if (isLocked) return <Lock size={13} className="text-text-muted shrink-0" />;
    const map = {
        video: <PlayCircle size={13} className="text-primary shrink-0" />,
        article: <FileText size={13} className="text-green-500 shrink-0" />,
        quiz: <HelpCircle size={13} className="text-orange-400 shrink-0" />,
    };
    return map[type] || map.video;
}

// ── Single lesson row ─────────────────────────────────────
function LessonRow({ lesson, isEnrolled }) {
    const isLocked = !lesson.is_free && !isEnrolled;
    const duration = formatDuration(lesson.duration);

    return (
        <div className={cn(
            "flex items-center gap-3 px-5 py-3",
            "border-b border-border last:border-0",
            !isLocked && "cursor-pointer hover:bg-primary-light transition-colors duration-150 group"
        )}>
            {/* Icon */}
            <LessonIcon type={lesson.type} isLocked={isLocked} />

            {/* Title */}
            <span className={cn(
                "flex-1 text-[13px] leading-snug",
                isLocked
                    ? "text-text-muted"
                    : "text-text-primary font-medium group-hover:text-primary transition-colors"
            )}>
                {lesson.title}
            </span>

            {/* Free preview badge */}
            {lesson.is_free === 1 && !isEnrolled && (
                <span className="flex items-center gap-1 text-[10.5px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full shrink-0">
                    <Eye size={10} /> Preview
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
    const [open, setOpen] = useState(index === 0);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || lessons.length > 0) return;
        const fetch = async () => {
            try {
                setLoading(true);
                const { data } = await lessonService.getBySectionId(section.id);
                setLessons(data.data.lessons);
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [open]);

    const totalDuration = lessons.reduce((s, l) => s + (l.duration || 0), 0);
    const duration = formatDuration(totalDuration);

    return (
        <div className={cn(
            "rounded-lg overflow-hidden border transition-all duration-200",
            open ? "border-primary/30" : "border-border"
        )}>
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-150",
                    open ? "bg-primary-light" : "bg-page hover:bg-border/20"
                )}
            >
                {/* Number */}
                <span className={cn(
                    "text-[13px] font-extrabold w-7 shrink-0",
                    open ? "text-primary" : "text-text-muted"
                )}>
                    {String(index + 1).padStart(2, "0")}
                </span>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-[13.5px] font-bold truncate",
                        open ? "text-primary" : "text-text-primary"
                    )}>
                        {section.title}
                    </p>
                    {lessons.length > 0 && (
                        <p className="text-[11.5px] text-text-muted mt-0.5">
                            {lessons.length} lessons{duration ? ` • ${duration}` : ""}
                        </p>
                    )}
                </div>

                {/* Chevron */}
                {open
                    ? <ChevronUp size={15} className={cn(open ? "text-primary" : "text-text-muted")} />
                    : <ChevronDown size={15} className="text-text-muted" />
                }
            </button>

            {/* Lessons */}
            {open && (
                <div className="bg-white">
                    {loading ? (
                        <div className="px-5 py-4 space-y-2">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-3 bg-border rounded animate-pulse w-full" />
                            ))}
                        </div>
                    ) : lessons.length > 0 ? (
                        lessons.map((lesson) => (
                            <LessonRow key={lesson.id} lesson={lesson} isEnrolled={isEnrolled} />
                        ))
                    ) : (
                        <p className="px-5 py-4 text-[13px] text-text-muted italic">
                            No lessons yet
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main ─────────────────────────────────────────────────
export default function CourseCurriculum({ sections = [], courseId, isEnrolled = false }) {
    if (sections.length === 0) {
        return (
            <p className="text-[13px] text-text-muted italic py-2">
                Curriculum not available yet.
            </p>
        );
    }

    return (
        <div className="space-y-2.5">
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