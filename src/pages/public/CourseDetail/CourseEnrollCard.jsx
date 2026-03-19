import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Clock, BarChart2, BookOpen,
    Award, Globe, PlayCircle, CheckCircle
} from "lucide-react";
import { selectIsLoggedIn } from "@/features/auth/authSlice";
import { cn } from "@/lib/utils";

/**
 * CourseEnrollCard.jsx
 * Sticky right side enrollment card.
 * Button has left-to-right hover sweep animation.
 */

function formatDuration(mins) {
    if (!mins || mins === 0) return "Self-paced";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
}

// ── Sweep button ──────────────────────────────────────────
function SweepButton({ children, onClick, href, className }) {
    const base = cn(
        "relative w-full flex items-center justify-center gap-2",
        "h-11 rounded overflow-hidden",
        "text-[14px] font-bold text-white transition-all duration-300",
        className
    );

    const inner = (
        <>
            {/* Sweep overlay */}
            <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
                style={{ background: "rgba(0,0,0,0.15)" }}
            />
            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </>
    );

    if (href) {
        return (
            <Link to={href} className={cn("group", base)}>
                {inner}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={cn("group", base)}>
            {inner}
        </button>
    );
}

export default function CourseEnrollCard({ course, isEnrolled = false, onEnroll }) {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    if (!course) return null;

    const {
        thumbnail,
        price,
        level,
        language,
        total_duration,
        total_lessons,
        certificate_eligible,
        preview_video,
    } = course;

    const META = [
        { icon: Clock, label: "Duration", value: formatDuration(total_duration) },
        { icon: BarChart2, label: "Level", value: level ? level.charAt(0).toUpperCase() + level.slice(1) : "All levels" },
        { icon: BookOpen, label: "Lessons", value: total_lessons > 0 ? `${total_lessons} lessons` : "Self-paced" },
        { icon: Globe, label: "Language", value: language || "English" },
        ...(certificate_eligible === 1
            ? [{ icon: Award, label: "Certificate", value: "Included" }]
            : []),
    ];

    return (
        <div
            className="bg-white rounded-lg overflow-hidden sticky top-[80px]"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
        >
            {/* Thumbnail */}
            <div
                className="relative h-[180px] flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0a2540 0%, #1a3a6c 100%)" }}
            >
                {thumbnail ? (
                    <img src={thumbnail} alt={course.title}
                        className="w-full h-full object-cover" />
                ) : (
                    // Clean pattern — no dots
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <BookOpen size={40} className="mx-auto mb-2 opacity-20 text-white" />
                            <p className="text-[11px] text-white/30 font-medium uppercase tracking-widest">
                                Course Preview
                            </p>
                        </div>
                    </div>
                )}

                {/* Play button */}
                {preview_video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                            style={{ background: "rgba(255,255,255,0.2)" }}>
                            <PlayCircle size={32} className="text-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5">

                {/* Price */}
                <div className="mb-4">
                    <span className="text-[30px] font-extrabold text-text-primary tracking-tight">
                        ${price}
                    </span>
                </div>

                {/* CTA */}
                {isEnrolled ? (
                    <SweepButton
                        href={`/student/learn/${course.id}`}
                        className="bg-primary"
                    >
                        <PlayCircle size={17} />
                        Continue Learning
                    </SweepButton>
                ) : isLoggedIn ? (
                    <SweepButton
                        onClick={onEnroll}
                        className="bg-primary"
                    >
                        Enroll Now
                    </SweepButton>
                ) : (
                    <SweepButton
                        href="/login"
                        className="bg-primary"
                    >
                        Login to Enroll
                    </SweepButton>
                )}

                {/* Guarantee */}
                <p className="text-[11.5px] text-text-muted text-center mt-2.5">
                    30-day money-back guarantee
                </p>

                {/* Divider */}
                <div className="h-px bg-border my-4" />

                {/* Meta */}
                <div className="space-y-3">
                    {META.map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <item.icon size={14} className="text-primary shrink-0" />
                            <span className="text-[12.5px] text-text-secondary flex-1">
                                {item.label}
                            </span>
                            <span className="text-[12.5px] font-semibold text-text-primary">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Certificate badge */}
                {certificate_eligible === 1 && (
                    <>
                        <div className="h-px bg-border my-4" />
                        <div className="flex items-center gap-2.5 bg-primary-light rounded-lg px-3.5 py-3">
                            <CheckCircle size={16} className="text-primary shrink-0" />
                            <p className="text-[12.5px] font-semibold text-primary">
                                Certificate of completion included
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}