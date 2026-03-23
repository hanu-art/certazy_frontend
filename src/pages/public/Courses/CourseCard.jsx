import { Link } from "react-router-dom";
import { Star, Clock, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
    "from-[#1a3a5c] to-[#2d6a9f]",
    "from-[#1a4a3c] to-[#2d8a6f]",
    "from-[#3c1a4a] to-[#6a2d8a]",
    "from-[#4a3c1a] to-[#8a6a2d]",
    "from-[#1a2a4a] to-[#2d4a8a]",
];

const LEVEL_STYLES = {
    beginner:     { bg: "bg-emerald-50 text-emerald-700 border-emerald-200",  dot: "bg-emerald-500" },
    intermediate: { bg: "bg-blue-50    text-blue-700    border-blue-200",     dot: "bg-blue-500"    },
    advanced:     { bg: "bg-violet-50  text-violet-700  border-violet-200",   dot: "bg-violet-500"  },
};

// ── Badge logic — pure frontend, no extra API ──────────────
function getCourseBadge(enrolled_count, created_at) {
    // Bestseller — 100+ enrollments
    if (enrolled_count >= 100) {
        return { label: "Bestseller", style: "bg-amber-400 text-amber-900" };
    }
    // New — created within last 30 days
    if (created_at) {
        const daysSince = (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince <= 30) {
            return { label: "New", style: "bg-emerald-500 text-white" };
        }
    }
    return null;
}

function formatDuration(mins) {
    if (!mins || mins === 0) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
}

export default function CourseCard({ course }) {
    const {
        id,
        title,
        slug,
        thumbnail,
        price,
        level,
        category_name,
        rating_avg     = 0,
        rating_count   = 0,
        enrolled_count = 0,
        total_duration = 0,
        certificate_eligible,
        instructor_name,
        created_at,
    } = course;

    const gradient = GRADIENTS[id % GRADIENTS.length];
    const duration  = formatDuration(total_duration);
    const badge     = getCourseBadge(enrolled_count, created_at);
    const levelStyle = LEVEL_STYLES[level];

    return (
        <Link
            to={`/courses/${slug}`}
            className="group bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer"
            style={{
                border: "1px solid #EEF2F7",
                boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
                transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,23,42,0.12)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.borderColor = "#DBEAFE";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#EEF2F7";
            }}
        >
            {/* ── Thumbnail ─────────────────────────────────── */}
            <div className={cn(
                "relative h-[176px] bg-gradient-to-br overflow-hidden",
                !thumbnail && gradient
            )}>
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    // Placeholder pattern
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="grid grid-cols-4 gap-3 p-4 opacity-[0.15]">
                            {Array(12).fill(0).map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-white" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* ── Top left — Bestseller / New badge ── */}
                {badge && (
                    <div className="absolute top-3 left-3">
                        <span className={cn(
                            "text-[10.5px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full",
                            badge.style
                        )}>
                            {badge.label}
                        </span>
                    </div>
                )}

                {/* ── Top right — Certificate OR category ── */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    {certificate_eligible === 1 && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <Award size={9} />
                            Certificate
                        </span>
                    )}
                </div>

                {/* ── Bottom left — Category ── */}
                <div className="absolute bottom-3 left-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {category_name}
                    </span>
                </div>
            </div>

            {/* ── Content ───────────────────────────────────── */}
            <div className="p-4 flex flex-col flex-1">

                {/* Title */}
                <h3 className="text-[13.5px] font-bold text-text-primary leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {title}
                </h3>

                {/* Instructor */}
                {instructor_name && (
                    <p className="text-[11.5px] text-text-muted mb-2.5 truncate">
                        {instructor_name}
                    </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                        {Array(5).fill(0).map((_, i) => (
                            <Star
                                key={i}
                                size={11}
                                className={cn(
                                    i < Math.round(rating_avg)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-[#E2E8F0] fill-[#E2E8F0]"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[12px] font-bold text-text-primary">
                        {rating_avg > 0 ? Number(rating_avg).toFixed(1) : "New"}
                    </span>
                    {rating_count > 0 && (
                        <span className="text-[11px] text-text-muted">
                            ({rating_count.toLocaleString()})
                        </span>
                    )}
                </div>

                <div className="flex-1" />

                {/* Level pill */}
                {levelStyle && (
                    <div className="mb-3">
                        <span className={cn(
                            "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize",
                            levelStyle.bg
                        )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", levelStyle.dot)} />
                            {level}
                        </span>
                    </div>
                )}

                {/* Divider */}
                <div className="h-px bg-[#F1F5F9] mb-3" />

                {/* Duration + Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-text-muted">
                        {duration ? (
                            <>
                                <Clock size={12} />
                                <span className="text-[12px]">{duration}</span>
                            </>
                        ) : enrolled_count > 0 ? (
                            <>
                                <Users size={12} />
                                <span className="text-[12px]">
                                    {enrolled_count >= 1000
                                        ? `${(enrolled_count / 1000).toFixed(1)}k`
                                        : enrolled_count
                                    } students
                                </span>
                            </>
                        ) : (
                            <span className="text-[12px]">Self-paced</span>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-[15px] font-extrabold text-primary">
                            ${price}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}