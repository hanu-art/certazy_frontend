import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { selectFilters, selectPagination, setFilter } from "@/features/course/courseSlice";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Most Popular", value: "popular" },
    { label: "Price: Low", value: "price_low" },
    { label: "Price: High", value: "price_high" },
    { label: "Top Rated", value: "rating" },
];

export default function CourseSortBar() {
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);
    const pagination = useSelector(selectPagination);

    const scrollRef = useRef(null);
    const [showFade, setShowFade] = useState(true);

    const { total, page, limit } = pagination;
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
        setShowFade(!atEnd);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        setShowFade(el.scrollWidth > el.clientWidth);
    }, []);

    return (
        <div
            className="bg-white rounded-lg px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
            {/* Course count */}
            <p className="text-[13px] text-text-muted shrink-0">
                {total === 0 ? "No courses" : `${from}–${to} of ${total}`}
            </p>

            {/* Sort chips — with right fade scroll hint */}
            <div className="relative flex-1 min-w-0 ml-auto">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex items-center gap-2 overflow-x-auto"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                dispatch(setFilter({
                                    key: "sort",
                                    value: filters.sort === opt.value ? null : opt.value,
                                }))
                            }
                            className={cn(
                                "px-3 py-1.5 rounded text-[12.5px] font-medium shrink-0",
                                "transition-colors duration-150",
                                filters.sort === opt.value
                                    ? "bg-primary text-white"
                                    : "bg-page text-text-secondary hover:bg-primary-light hover:text-primary border border-border"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Fade gradient — scroll hint for user */}
                {showFade && (
                    <div
                        className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none"
                        style={{ background: "linear-gradient(to right, transparent, white)" }}
                    />
                )}
            </div>
        </div>
    );
}