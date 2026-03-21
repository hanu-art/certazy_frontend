import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, BookOpen, X } from "lucide-react";
import courseService from "@/services/courseService";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export default function SearchBar({ className }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const debouncedQuery = useDebounce(query, 400);

    useEffect(() => {
        if (debouncedQuery.trim().length < 3) {
            setResults([]);
            setDropOpen(false);
            return;
        }
        const fetchResults = async () => {
            try {
                setLoading(true);
                const { data } = await courseService.getAll({
                    search: debouncedQuery.trim(),
                    limit: 6,
                    status: "published",
                });
                setResults(data.data || []);
                setDropOpen(true);
            } catch (err) {
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [debouncedQuery]);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target))
                setDropOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") {
                setDropOpen(false);
                inputRef.current?.blur();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const handleCourseClick = (slug) => { setDropOpen(false); setQuery(""); navigate(`/courses/${slug}`); };
    const handleViewAll = () => { setDropOpen(false); navigate(`/courses?search=${encodeURIComponent(query.trim())}`); setQuery(""); };
    const handleClear = () => { setQuery(""); setResults([]); setDropOpen(false); inputRef.current?.focus(); };
    const handleSubmit = (e) => { e.preventDefault(); if (query.trim().length < 3) return; handleViewAll(); };

    return (
        <div ref={containerRef} className={cn("relative flex-1", className)}>

            {/* ── Input ── */}
            <form onSubmit={handleSubmit}>
                <div className={cn(
                    "flex items-center gap-2 h-[36px] px-3.5",
                    "bg-[#F5F7FA] border border-transparent rounded-full",
                    "transition-all duration-200",
                    focused && "bg-white border-primary shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"
                )}>
                    {loading
                        ? <Loader2 size={14} className="shrink-0 text-primary animate-spin" />
                        : <Search size={14} className={cn(
                            "shrink-0 transition-colors duration-200",
                            focused ? "text-primary" : "text-text-muted"
                        )} />
                    }

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { setFocused(true); if (results.length > 0) setDropOpen(true); }}
                        onBlur={() => setFocused(false)}
                        placeholder="Search insights..."
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] text-text-primary placeholder:text-text-muted"
                    />

                    {query.length > 0 && (
                        <button type="button" onClick={handleClear}
                            className="shrink-0 text-text-muted hover:text-text-primary transition-colors">
                            <X size={13} />
                        </button>
                    )}
                </div>
            </form>

            {/* ── Dropdown ── */}
            {dropOpen && (
                <div
                    className="absolute top-[calc(100%+20px)] left-0 right-0 bg-white rounded-xl overflow-hidden z-50 border border-border"
                    style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                >
                    {results.length > 0 ? (
                        <>
                            {results.slice(0, 5).map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => handleCourseClick(course.slug)}
                                    className={cn(
                                        "w-full flex items-start gap-3 px-4 py-3 text-left",
                                        "hover:bg-primary-light transition-colors duration-150",
                                        "border-b border-border last:border-0"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-primary-light shrink-0 flex items-center justify-center mt-0.5">
                                        <BookOpen size={14} className="text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-semibold text-text-primary truncate">{course.title}</p>
                                        <p className="text-[11.5px] text-text-muted mt-0.5">{course.category_name} • {course.level}</p>
                                    </div>
                                    <span className="text-[13px] font-semibold text-primary shrink-0">${course.price}</span>
                                </button>
                            ))}
                            <button
                                onClick={handleViewAll}
                                className="w-full px-4 py-2.5 text-center text-[13px] font-semibold text-primary hover:bg-primary-light transition-colors duration-150 border-t border-border"
                            >
                                View all results for "{query}" →
                            </button>
                        </>
                    ) : (
                        <div className="px-4 py-6 text-center">
                            <p className="text-[13px] text-text-muted">
                                No courses found for "<span className="font-semibold text-text-primary">{query}</span>"
                            </p>
                            <button onClick={handleViewAll}
                                className="mt-2 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors">
                                Browse all courses →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}