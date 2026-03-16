import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import categoryService from "@/services/categoryService";
import { cn } from "@/lib/utils";

/**
 * MegaMenu.jsx
 *
 * "All Courses" button click pe open hota hai.
 * Categories real API se fetch hoti hain.
 *
 * API: GET /api/v1/categories
 * Response: [
 *   {
 *     id, name, slug,
 *     children: [ { id, name, slug }, ... ]
 *   }
 * ]
 *
 * 3 click flows:
 *   Child click    → /courses?category=:childSlug   (specific courses)
 *   "More X →"     → /courses?category=:parentSlug  (all in parent)
 *   "All Courses →" → /courses                      (sab courses)
 */
export default function MegaMenu({ onClose }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch categories on mount ────────────────────────────
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const { data } = await categoryService.getAll();
                setCategories(data.data); // backend → { success, data: [...] }
            } catch (err) {
                setError("Categories load nahi hui. Please retry.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        // ── Backdrop — click bahar toh close ──────────────────
        <div
            className="fixed inset-0 z-50 top-[112px]"
            onClick={onClose}
        >
            {/* ── Panel ── */}
            <div
                className="relative max-w-[1280px] mx-auto px-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white border border-border rounded-lg shadow-drop overflow-hidden">

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div>
                            <p className="text-[14px] font-bold text-text-primary">
                                Browse by Category
                            </p>
                            <p className="text-[12.5px] text-text-muted mt-0.5">
                                Apni category choose karo aur courses explore karo
                            </p>
                        </div>
                        <Link
                            to="/courses"
                            onClick={onClose}
                            className="flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
                        >
                            All Courses
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* ── Body ── */}
                    <div className="p-4">
                        {/* Loading state */}
                        {loading && (
                            <div className="flex items-center justify-center py-12 gap-2 text-text-muted">
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-[13.5px]">Loading categories...</span>
                            </div>
                        )}

                        {/* Error state */}
                        {!loading && error && (
                            <div className="text-center py-12">
                                <p className="text-[13.5px] text-red-500">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 text-[13px] text-primary underline"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Categories grid — top 3 featured */}
                        {!loading && !error && categories.length > 0 && (
                            <>
                                {/* Top row — first 3 parent categories featured */}
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    {categories.slice(0, 3).map((cat) => (
                                        <FeaturedCategory
                                            key={cat.id}
                                            category={cat}
                                            onClose={onClose}
                                        />
                                    ))}
                                </div>

                                {/* Bottom row — remaining categories as pills */}
                                {categories.length > 3 && (
                                    <div className="border-t border-border pt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {categories.slice(3).map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/courses?category=${cat.slug}`}
                                                    onClick={onClose}
                                                    className={cn(
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded",
                                                        "text-[13px] font-medium text-text-secondary",
                                                        "hover:bg-primary-light hover:text-primary",
                                                        "border border-border hover:border-primary",
                                                        "transition-all duration-150"
                                                    )}
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}

                                            {/* All courses link */}
                                            <Link
                                                to="/courses"
                                                onClick={onClose}
                                                className={cn(
                                                    "flex items-center gap-1 px-3 py-1.5 ml-auto",
                                                    "text-[13px] font-semibold text-primary",
                                                    "hover:text-primary-hover transition-colors"
                                                )}
                                            >
                                                All Courses <ArrowRight size={13} />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Featured category column (top 3) ─────────────────────
function FeaturedCategory({ category, onClose }) {
    // Show max 5 children
    const visibleChildren = category.children?.slice(0, 5) || [];
    const hasMore = (category.children?.length || 0) > 5;

    return (
        <div className="p-3 border border-border rounded-lg">
            {/* Parent category name */}
            <Link
                to={`/courses?category=${category.slug}`}
                onClick={onClose}
                className="flex items-center gap-2 mb-2 group"
            >
                <span className="text-[13.5px] font-bold text-text-primary group-hover:text-primary transition-colors">
                    {category.name}
                </span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-border mb-2" />

            {/* Children */}
            <ul className="space-y-0.5">
                {visibleChildren.map((child) => (
                    <li key={child.id}>
                        <Link
                            to={`/courses?category=${child.slug}`}
                            onClick={onClose}
                            className={cn(
                                "block px-2 py-1.5 rounded text-[13px] text-text-secondary",
                                "hover:bg-primary-light hover:text-primary",
                                "transition-colors duration-150"
                            )}
                        >
                            {child.name}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* More → link */}
            <Link
                to={`/courses?category=${category.slug}`}
                onClick={onClose}
                className="flex items-center gap-1 mt-2 px-2 text-[12.5px] font-semibold text-primary hover:text-primary-hover transition-colors"
            >
                More {category.name} <ArrowRight size={12} />
            </Link>
        </div>
    );
}