import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LayoutGrid, Menu, X } from "lucide-react";

import { selectIsLoggedIn, selectUser } from "@/features/auth/authSlice";
import SearchBar from "./SearchBar";
import NavLinks from "./NavLinks";
import MegaMenu from "./MegaMenu";
import NotificationBell from "./NotificationBell";
import AvatarMenu from "./AvatarMenu";
import MobileMenu from "./MobileMenu";
import { cn } from "@/lib/utils";

/**
 * Navbar — index.jsx
 *
 * Entry point — sirf layout + state hai yahan.
 * Har cheez apne component mein hai.
 *
 * States:
 *   Public  → not logged in  → Login + Register buttons
 *   Student → logged in      → My Learning + Bell + Avatar
 */
export default function Navbar() {
    const [megaOpen, setMegaOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // ── Redux auth state ──────────────────────────────────────
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(selectUser);

    // ── Handlers ─────────────────────────────────────────────
    const toggleMega = () => {
        setMegaOpen((prev) => !prev);
        setMobileOpen(false);
    };

    const toggleMobile = () => {
        setMobileOpen((prev) => !prev);
        setMegaOpen(false);
    };

    const closeMega = () => setMegaOpen(false);
    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            {/* ── NAVBAR ── */}
            <header
                className="sticky top-0 z-40 bg-white border-b border-border shadow-navbar"
            >
                <div className="max-w-[1280px] mx-auto px-6 h-navbar flex items-center gap-5">

                    {/* Logo */}
                    <Logo />

                    {/* All Courses — MegaMenu trigger */}
                    <AllCoursesBtn isOpen={megaOpen} onClick={toggleMega} />

                    {/* Search — desktop only */}
                    <div className="hidden md:flex flex-1 max-w-[400px]">
                        <SearchBar />
                    </div>

                    {/* Nav links — desktop only */}
                    <NavLinks />

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Right side */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        {isLoggedIn && user ? (
                            <>
                                {/* My Learning — desktop only */}
                                <Link
                                    to="/student/my-courses"
                                    className={cn(
                                        "hidden md:block",
                                        "text-[14px] font-medium text-text-secondary",
                                        "hover:text-primary transition-colors duration-200"
                                    )}
                                >
                                    My Learning
                                </Link>

                                {/* Notification bell */}
                                <NotificationBell unreadCount={user.unreadCount ?? 0} />

                                {/* Avatar dropdown */}
                                <AvatarMenu user={user} />
                            </>
                        ) : (
                            <>
                                <LoginBtn />
                                <RegisterBtn />
                            </>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            onClick={toggleMobile}
                            className={cn(
                                "md:hidden flex items-center justify-center",
                                "w-9 h-9 rounded",
                                "border border-border",
                                "text-text-secondary",
                                "hover:text-primary hover:border-primary",
                                "transition-colors duration-200"
                            )}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <MobileMenu
                        isLoggedIn={isLoggedIn}
                        user={user}
                        onClose={closeMobile}
                    />
                )}
            </header>

            {/* MegaMenu — outside header so it overlays page content */}
            {megaOpen && <MegaMenu onClose={closeMega} />}
        </>
    );
}

// ─────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────

function Logo() {
    return (
        <Link
            to="/"
            className="flex items-center gap-2 shrink-0 no-underline"
        >
            <div className="w-[30px] h-[30px] rounded bg-primary flex items-center justify-center shrink-0">
                <svg
                    width="17" height="17" viewBox="0 0 24 24"
                    fill="none" stroke="white"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            </div>
            <span className="text-[17px] font-extrabold text-text-primary tracking-tight">
                Cert<span className="text-primary">azy</span>
            </span>
        </Link>
    );
}

function AllCoursesBtn({ isOpen, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.5 h-9 px-3.5 rounded shrink-0",
                "text-[13.5px] font-semibold font-sans text-white",
                "transition-colors duration-200",
                isOpen ? "bg-primary-hover" : "bg-primary hover:bg-primary-hover"
            )}
        >
            <LayoutGrid size={14} />
            All Courses
        </button>
    );
}

function LoginBtn() {
    return (
        <Link
            to="/login"
            className={cn(
                "hidden sm:flex items-center h-9 px-4 rounded shrink-0",
                "border-[1.5px] border-border",
                "text-[13.5px] font-semibold text-text-primary",
                "hover:border-primary hover:text-primary",
                "transition-colors duration-200"
            )}
        >
            Login
        </Link>
    );
}

function RegisterBtn() {
    return (
        <Link
            to="/register"
            className={cn(
                "flex items-center h-9 px-4 rounded shrink-0",
                "bg-primary hover:bg-primary-hover",
                "text-[13.5px] font-semibold text-white",
                "transition-colors duration-200"
            )}
        >
            Register
        </Link>
    );
}