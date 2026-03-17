import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LayoutGrid, Menu, X } from "lucide-react";

import { selectIsLoggedIn, selectUser } from "@/features/auth/authSlice";
import Searchbar from "./Searchbar ";
import NavLinks from "./NavLinks";
import MegaMenu from "./MegaMenu";
import NotificationBell from "./NotificationBell";
import AvatarMenu from "./AvatarMenu";
import MobileMenu from "./MobileMenu";
import { cn } from "@/lib/utils";

function NavBarIndex() {
    const [megaOpen, setMegaOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(selectUser);

    const toggleMega = () => {
        setMegaOpen((p) => !p);
        setMobileOpen(false);
    };

    const toggleMobile = () => {
        setMobileOpen((p) => !p);
        setMegaOpen(false);
    };

    const closeMega = () => setMegaOpen(false);
    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            <header className="sticky top-0 z-40 bg-white border-b border-border shadow-navbar">
                <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center gap-4 md:gap-8">

                    {/* LEFT */}
                    <div className="flex items-center gap-4 shrink-0">
                        <Logo />
                        <AllCoursesBtn isOpen={megaOpen} onClick={toggleMega} />
                    </div>

                    {/* CENTER SEARCH */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="w-[340px]">
                            <Searchbar />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4 shrink-0 ml-auto">

                        <div className="hidden md:block">
                            <NavLinks />
                        </div>

                        {isLoggedIn && user ? (
                            <>
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

                                <div className="hidden md:block">
                                    <NotificationBell unreadCount={user.unreadCount ?? 0} />
                                </div>

                                <div className="hidden md:block">
                                    <AvatarMenu user={user} />
                                </div>
                            </>
                        ) : (
                            <>
                                <LoginBtn />
                                <RegisterBtn />
                            </>
                        )}

                        {/* Mobile menu */}
                        <button
                            onClick={toggleMobile}
                            className={cn(
                                "md:hidden flex items-center justify-center",
                                "w-9 h-9 rounded border border-border",
                                "text-text-secondary",
                                "hover:text-primary hover:border-primary",
                                "transition-colors duration-200"
                            )}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>

                    </div>
                </div>

                {mobileOpen && (
                    <MobileMenu
                        isLoggedIn={isLoggedIn}
                        user={user}
                        onClose={closeMobile}
                    />
                )}
            </header>

            {megaOpen && <MegaMenu onClose={closeMega} />}
        </>
    );
}

function Logo() {
    return (
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline mr-2">
            <div className="w-[30px] h-[30px] rounded bg-primary flex items-center justify-center shrink-0">
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                "flex items-center gap-1.5 h-9 px-4.5 rounded shrink-0",
                "text-[13.5px] font-semibold text-white font-sans",
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
                "hidden md:flex items-center h-9 px-5 rounded shrink-0",
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
                "hidden md:flex items-center h-9 px-5 rounded shrink-0",
                "bg-primary hover:bg-primary-hover",
                "text-[13.5px] font-semibold text-white",
                "transition-colors duration-200"
            )}
        >
            Register
        </Link>
    );
}

export default NavBarIndex;