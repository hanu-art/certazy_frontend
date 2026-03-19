import { useDispatch, useSelector } from "react-redux";
import { selectFilters, selectPagination, setFilter } from "@/features/course/courseSlice";
import { cn } from "@/lib/utils";

/**
 * CourseSortBar.jsx
 *
 * Top bar — shows course count + sort chips.
 * Reads pagination + filters from Redux.
 */

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

    const { total, page, limit } = pagination;

    // e.g. "Showing 1–12 of 40 courses"
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="bg-white rounded-lg px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
            {/* Course count */}
            <p className="text-[13px] text-text-muted shrink-0">
                {total === 0
                    ? "No courses found"
                    : `Showing ${from}–${to} of ${total} courses`
                }
            </p>

            {/* Sort chips */}
            <div className="flex items-center gap-2 flex-wrap">
                {SORT_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() =>
                            dispatch(
                                setFilter({
                                    key: "sort",
                                    value: filters.sort === opt.value ? null : opt.value,
                                })
                            )
                        }
                        className={cn(
                            "px-3 py-1.5 rounded text-[12.5px] font-medium",
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
        </div>
    );
}