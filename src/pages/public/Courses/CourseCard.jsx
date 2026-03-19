import { Link } from "react-router-dom";
import { Star, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CourseCard.jsx
 *
 * Design: Editorial Scholar style
 * - Category badge overlay on thumbnail (top left)
 * - Title, instructor, rating below image
 * - Duration left + Price right at bottom
 * - Full card clickable — no button
 */

// Gradient thumbnails — only for placeholder when no real thumbnail
const GRADIENTS = [
    "from-[#1a3a5c] to-[#2d6a9f]",
    "from-[#1a4a3c] to-[#2d8a6f]",
    "from-[#3c1a4a] to-[#6a2d8a]",
    "from-[#4a3c1a] to-[#8a6a2d]",
    "from-[#1a2a4a] to-[#2d4a8a]",
];

// Level pill colors
const LEVEL_STYLES = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-blue-100 text-blue-700",
    advanced: "bg-purple-100 text-purple-700",
};

export default function CourseCard({ course }) {
    const {
        id,
        title,
        slug,
        thumbnail,
        price,
        level,
        category_name,
        rating_avg = 0,
        rating_count = 0,
        enrolled_count = 0,
        total_duration = 0,
        certificate_eligible,
        instructor_name,
    } = course;

    const gradient = GRADIENTS[id % GRADIENTS.length];

    // Format duration — minutes to hours
    const formatDuration = (mins) => {
        if (!mins || mins === 0) return null;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
    };

    const duration = formatDuration(total_duration);

    return (
        <Link
            to={`/courses/${slug}`}
            className="group bg-white rounded-lg overflow-hidden flex flex-col cursor-pointer"
            style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* ── Thumbnail ── */}
            <div className={cn(
                "relative h-[180px] bg-gradient-to-br overflow-hidden",
                !thumbnail && gradient
            )}>
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="grid grid-cols-4 gap-3 p-4 opacity-20">
                            {Array(12).fill(0).map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-white" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Category badge — top left */}
                <div className="absolute top-3 left-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {category_name}
                    </span>
                </div>

                {/* Certificate badge — top right */}
                {certificate_eligible === 1 && (
                    <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-semibold text-white bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            Certificate
                        </span>
                    </div>
                )}
            </div>

            {/* ── Content ── */}
            <div className="p-4 flex flex-col flex-1">

                {/* Title */}
                <h3 className="text-[14px] font-bold text-text-primary leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {title}
                </h3>

                {/* Instructor */}
                {instructor_name && (
                    <p className="text-[12px] text-text-muted mb-2">
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
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-border fill-border"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[12px] font-semibold text-text-primary">
                        {rating_avg > 0 ? Number(rating_avg).toFixed(1) : "New"}
                    </span>
                    {rating_count > 0 && (
                        <span className="text-[11.5px] text-text-muted">
                            ({rating_count.toLocaleString()})
                        </span>
                    )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Level pill */}
                <div className="mb-3">
                    <span className={cn(
                        "text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize",
                        LEVEL_STYLES[level] || "bg-page text-text-secondary"
                    )}>
                        {level}
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-border mb-3" />

                {/* Duration + Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-text-muted">
                        {duration ? (
                            <>
                                <Clock size={12} />
                                <span className="text-[12px]">{duration}</span>
                            </>
                        ) : enrolled_count > 0 ? (
                            <>
                                <Users size={12} />
                                <span className="text-[12px]">{enrolled_count.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="text-[12px]">Self-paced</span>
                        )}
                    </div>

                    {/* Price */}
                    <span className="text-[15px] font-extrabold text-primary">
                        ${price}
                    </span>
                </div>
            </div>
        </Link>
    );
}