import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Loader2 } from "lucide-react";
import categoryService from "@/services/categoryService";
import Searchbar from "./Searchbar ";
import { MORE_ITEMS, STUDENT_MENU_ITEMS } from "./navbar.data";
import { cn } from "@/lib/utils";

/**
 * MobileMenu.jsx
 *
 * Mobile hamburger menu — shown below md breakpoint (768px)
 *
 * Props:
 *   isLoggedIn → boolean
 *   user       → { name, email, role } or null
 *   onClose    → close menu callback
 */
export default function MobileMenu({ isLoggedIn, user, onClose }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [catOpen, setCatOpen] = useState(false);

    // ── Fetch categories ─────────────────────────────────────
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await categoryService.getAll();
                setCategories(data.data);
            } catch {
                // silent fail — categories nahi dikhenge
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="border-t border-border bg-white animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-5 py-4 space-y-1 max-h-[80vh] overflow-y-auto">

                {/* Search */}
                <div className="pb-3">
                    <Searchbar className="max-w-full" />
                </div>

                {/* Categories accordion */}
                <button
                    onClick={() => setCatOpen(!catOpen)}
                    className={cn(
                        "w-full flex items-center justify-between",
                        "px-2 py-2.5 rounded text-[14px] font-medium",
                        "text-text-secondary hover:bg-primary-light hover:text-primary",
                        "transition-colors duration-150"
                    )}
                >
                    Browse Categories
                    <ChevronDown
                        size={15}
                        className={cn(
                            "transition-transform duration-200",
                            catOpen && "rotate-180"
                        )}
                    />
                </button>

                {/* Categories list */}
                {catOpen && (
                    <div className="pl-3 space-y-0.5 pb-1">
                        {loading ? (
                            <div className="flex items-center gap-2 py-3 text-text-muted">
                                <Loader2 size={14} className="animate-spin" />
                                <span className="text-[13px]">Loading...</span>
                            </div>
                        ) : (
                            <>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        to={`/courses?category=${cat.slug}`}
                                        onClick={onClose}
                                        className={cn(
                                            "block px-2 py-2 rounded",
                                            "text-[13.5px] font-medium text-text-secondary",
                                            "hover:bg-primary-light hover:text-primary",
                                            "transition-colors duration-150"
                                        )}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/courses"
                                    onClick={onClose}
                                    className="block px-2 py-2 text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors"
                                >
                                    View all courses →
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* More items */}
                {MORE_ITEMS.map((item, i) =>
                    item.divider ? (
                        <div key={i} className="h-px bg-border my-1" />
                    ) : (
                        <Link
                            key={i}
                            to={item.to}
                            onClick={onClose}
                            className={cn(
                                "block px-2 py-2.5 rounded",
                                "text-[14px] font-medium text-text-secondary",
                                "hover:bg-primary-light hover:text-primary",
                                "transition-colors duration-150"
                            )}
                        >
                            {item.label}
                        </Link>
                    )
                )}

                {/* Divider */}
                <div className="h-px bg-border my-1" />

                {/* Student menu — logged in */}
                {isLoggedIn && user && (
                    <div className="pt-1 space-y-0.5">
                        {STUDENT_MENU_ITEMS.map((item, i) =>
                            item.divider ? (
                                <div key={i} className="h-px bg-border my-1" />
                            ) : (
                                <Link
                                    key={i}
                                    to={item.to}
                                    onClick={onClose}
                                    className={cn(
                                        "block px-2 py-2.5 rounded text-[14px] font-medium",
                                        "transition-colors duration-150",
                                        item.danger
                                            ? "text-red-500 hover:bg-red-50"
                                            : "text-text-secondary hover:bg-primary-light hover:text-primary"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        )}
                    </div>
                )}

                {/* Auth buttons — not logged in */}
                {!isLoggedIn && (
                    <div className="flex gap-2.5 pt-3">
                        <Link
                            to="/login"
                            onClick={onClose}
                            className={cn(
                                "flex-1 text-center py-2.5 rounded",
                                "border-[1.5px] border-border",
                                "text-[14px] font-semibold text-text-primary",
                                "hover:border-primary hover:text-primary transition-colors"
                            )}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            onClick={onClose}
                            className={cn(
                                "flex-1 text-center py-2.5 rounded",
                                "bg-primary hover:bg-primary-hover",
                                "text-[14px] font-semibold text-white",
                                "transition-colors duration-200"
                            )}
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}