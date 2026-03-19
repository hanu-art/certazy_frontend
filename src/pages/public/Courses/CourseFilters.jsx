import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    selectFilters,
    setFilter,
    clearFilters,
} from "@/features/course/courseSlice";
import { cn } from "@/lib/utils";

/**
 * CourseFilters.jsx
 *
 * Premium sidebar filters:
 *   Category — parent accordion → children
 *   Level    — Beginner / Intermediate / Advanced
 */

const LEVELS = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
];

export default function CourseFilters({ categories = [] }) {
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);

    const hasActiveFilters = filters.category_id || filters.level;

    return (
        <aside
            className="w-[230px] shrink-0 bg-white rounded-lg overflow-hidden"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <p className="text-[13.5px] font-bold text-text-primary">
                    Filter by
                </p>
                {hasActiveFilters && (
                    <button
                        onClick={() => dispatch(clearFilters())}
                        className="text-[12px] font-medium text-primary hover:text-primary-hover transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Category filter */}
            <FilterSection title="Category">
                {categories.map((parent) => (
                    <ParentCategory
                        key={parent.id}
                        parent={parent}
                        activeId={filters.category_id}
                        onSelect={(id) =>
                            dispatch(
                                setFilter({
                                    key: "category_id",
                                    value: filters.category_id === id ? null : id,
                                })
                            )
                        }
                    />
                ))}
            </FilterSection>

            {/* Level filter */}
            <FilterSection title="Level">
                {LEVELS.map((lvl) => (
                    <FilterItem
                        key={lvl.value}
                        label={lvl.label}
                        active={filters.level === lvl.value}
                        onClick={() =>
                            dispatch(
                                setFilter({
                                    key: "level",
                                    value: filters.level === lvl.value ? null : lvl.value,
                                })
                            )
                        }
                    />
                ))}
            </FilterSection>
        </aside>
    );
}

// ── Collapsible section ───────────────────────────────────
function FilterSection({ title, children }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="border-b border-border last:border-0">
            {/* Section header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-page transition-colors"
            >
                <div className="flex items-center gap-2">
                    {/* Colored bar */}
                    <div className="w-[3px] h-4 bg-primary rounded-full" />
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                        {title}
                    </span>
                </div>
                {open
                    ? <ChevronUp size={13} className="text-text-muted" />
                    : <ChevronDown size={13} className="text-text-muted" />
                }
            </button>

            {/* Items */}
            {open && (
                <div className="px-3 pb-3 space-y-0.5">
                    {children}
                </div>
            )}
        </div>
    );
}

// ── Parent category — expandable ──────────────────────────
function ParentCategory({ parent, activeId, onSelect }) {
    const isChildActive = parent.children?.some((c) => c.id === activeId);
    const [expanded, setExpanded] = useState(isChildActive);
    const hasChildren = parent.children?.length > 0;

    return (
        <div>
            {/* Parent row */}
            <button
                onClick={() => hasChildren && setExpanded(!expanded)}
                className={cn(
                    "w-full flex items-center justify-between px-2 py-2 rounded-md",
                    "transition-colors duration-150",
                    isChildActive
                        ? "text-primary bg-primary-light"
                        : "text-text-primary hover:bg-page"
                )}
            >
                <span className="text-[13px] font-semibold truncate text-left">
                    {parent.name}
                </span>
                {hasChildren && (
                    <span className="shrink-0 ml-1">
                        {expanded
                            ? <ChevronUp size={12} className="text-text-muted" />
                            : <ChevronDown size={12} className="text-text-muted" />
                        }
                    </span>
                )}
            </button>

            {/* Children */}
            {expanded && hasChildren && (
                <div className="pl-3 mt-0.5 space-y-0.5">
                    {parent.children.map((child) => (
                        <FilterItem
                            key={child.id}
                            label={child.name}
                            active={activeId === child.id}
                            onClick={() => onSelect(child.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Single filter item ────────────────────────────────────
function FilterItem({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left",
                "transition-colors duration-150",
                active
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-page hover:text-text-primary"
            )}
        >
            {/* Checkbox */}
            <div className={cn(
                "w-[15px] h-[15px] rounded border-[1.5px] shrink-0",
                "flex items-center justify-center transition-all duration-150",
                active
                    ? "bg-primary border-primary"
                    : "border-border bg-white"
            )}>
                {active && (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>

            <span className="text-[12.5px] font-medium truncate">
                {label}
            </span>
        </button>
    );
}