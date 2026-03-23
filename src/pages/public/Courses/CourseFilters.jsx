import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    selectFilters,
    setFilter,
    clearFilters,
} from "@/features/course/courseSlice";
import { cn } from "@/lib/utils";

const LEVELS = [
    { label: "Beginner", value: "beginner", color: "bg-green-100 text-green-700" },
    { label: "Intermediate", value: "intermediate", color: "bg-blue-100 text-blue-700" },
    { label: "Advanced", value: "advanced", color: "bg-purple-100 text-purple-700" },
];

export default function CourseFilters({ categories = [] }) {
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);

    const hasActiveFilters = filters.category_id || filters.level;
    const activeCount = [filters.category_id, filters.level].filter(Boolean).length;

    return (
        <aside className="w-[240px] shrink-0 rounded-xl overflow-hidden border border-border bg-white"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: "1px solid var(--border, #E2E8F0)" }}
            >
                <div className="flex items-center gap-2">
                    <p className="text-[13.5px] font-bold text-text-primary">Filters</p>
                    {hasActiveFilters && (
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={() => dispatch(clearFilters())}
                        className="text-[12px] font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Category filter */}
            <FilterSection title="Category" icon="🗂️">
                {categories.map((parent) => (
                    <ParentCategory
                        key={parent.id}
                        parent={parent}
                        activeId={filters.category_id}
                        onSelect={(id) =>
                            dispatch(setFilter({
                                key: "category_id",
                                value: filters.category_id === id ? null : id,
                            }))
                        }
                    />
                ))}
            </FilterSection>

            {/* Level filter */}
            <FilterSection title="Level" icon="📊">
                <div className="flex flex-col gap-1.5">
                    {LEVELS.map((lvl) => (
                        <button
                            key={lvl.value}
                            onClick={() =>
                                dispatch(setFilter({
                                    key: "level",
                                    value: filters.level === lvl.value ? null : lvl.value,
                                }))
                            }
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left",
                                "transition-all duration-150",
                                filters.level === lvl.value
                                    ? "border-primary bg-primary-light"
                                    : "border-border bg-white hover:border-primary/40 hover:bg-page"
                            )}
                        >
                            <div className="flex items-center gap-2.5">
                                {/* Custom radio */}
                                <div className={cn(
                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                    filters.level === lvl.value
                                        ? "border-primary bg-primary"
                                        : "border-border bg-white"
                                )}>
                                    {filters.level === lvl.value && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[13px] font-semibold transition-colors",
                                    filters.level === lvl.value ? "text-primary" : "text-text-primary"
                                )}>
                                    {lvl.label}
                                </span>
                            </div>
                            {/* Level badge */}
                            <span className={cn("text-[10.5px] font-bold px-2 py-0.5 rounded-full", lvl.color)}>
                                {lvl.label.slice(0, 3)}
                            </span>
                        </button>
                    ))}
                </div>
            </FilterSection>
        </aside>
    );
}

// ── Collapsible section ────────────────────────────────────
function FilterSection({ title, icon, children }) {
    const [open, setOpen] = useState(true);

    return (
        <div style={{ borderBottom: "1px solid var(--border, #E2E8F0)" }} className="last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-page transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-[13px]">{icon}</span>
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                        {title}
                    </span>
                </div>
                {open
                    ? <ChevronUp size={13} className="text-text-muted" />
                    : <ChevronDown size={13} className="text-text-muted" />
                }
            </button>

            {open && (
                <div className="px-3 pb-3 space-y-0.5">
                    {children}
                </div>
            )}
        </div>
    );
}

// ── Parent category ────────────────────────────────────────
function ParentCategory({ parent, activeId, onSelect }) {
    const isChildActive = parent.children?.some((c) => c.id === activeId);
    const [expanded, setExpanded] = useState(isChildActive);
    const hasChildren = parent.children?.length > 0;

    return (
        <div>
            <button
                onClick={() => hasChildren && setExpanded(!expanded)}
                className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 rounded-lg",
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

            {expanded && hasChildren && (
                <div className="pl-3 mt-0.5 space-y-0.5 border-l-2 border-primary-light ml-3">
                    {parent.children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => onSelect(child.id)}
                            className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left",
                                "transition-colors duration-150",
                                activeId === child.id
                                    ? "bg-primary-light text-primary"
                                    : "text-text-secondary hover:bg-page hover:text-text-primary"
                            )}
                        >
                            {/* Dot indicator */}
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                                activeId === child.id ? "bg-primary" : "bg-border"
                            )} />
                            <span className="text-[12.5px] font-medium truncate">
                                {child.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}