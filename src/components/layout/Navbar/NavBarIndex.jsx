import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";

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

    const toggleMega = () => { setMegaOpen((p) => !p); setMobileOpen(false); };
    const toggleMobile = () => { setMobileOpen((p) => !p); setMegaOpen(false); };
    const closeMega = () => setMegaOpen(false);
    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            <header className="sticky top-0 z-40 bg-white border-b border-border">
                <div className="max-w-[1280px] mx-auto px-6 h-[60px] flex items-center">

                    {/* Logo */}
                    <Logo />

                    {/* Nav links — logo ke baad, gap-8 between links */}
                    <div className="hidden md:block ml-8">
                        <NavLinks megaOpen={megaOpen} onToggleMega={toggleMega} />
                    </div>

                    {/* ml-auto — right group ko right side push karta hai
                        gap between More and Search = jo bhi bachi jagah hai,
                        not forced flex-1 */}
                    <div className="hidden md:flex items-center gap-3 ml-auto">
                        <div className="w-[200px] lg:w-[230px]">
                            <Searchbar />
                        </div>

                        {isLoggedIn && user ? (
                            <>
                                <Link
                                    to="/student/my-courses"
                                    className="hidden lg:block text-[13.5px] font-medium text-text-secondary hover:text-primary transition-colors whitespace-nowrap"
                                >
                                    My Learning
                                </Link>
                                <NotificationBell unreadCount={user.unreadCount ?? 0} />
                                <AvatarMenu user={user} />
                            </>
                        ) : (
                            <>
                                <LoginBtn />
                                <RegisterBtn />
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={toggleMobile}
                        aria-label="Toggle menu"
                        className={cn(
                            "md:hidden flex items-center justify-center ml-auto",
                            "w-8 h-8 rounded text-text-secondary",
                            "hover:text-primary hover:bg-primary-light transition-colors duration-200"
                        )}
                    >
                        {mobileOpen ? <X size={19} /> : <Menu size={19} />}
                    </button>
                </div>

                {mobileOpen && (
                    <MobileMenu isLoggedIn={isLoggedIn} user={user} onClose={closeMobile} />
                )}
            </header>

            {megaOpen && <MegaMenu onClose={closeMega} />}
        </>
    );
}

function Logo() {
    return (
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
            <div className="w-[28px] h-[28px] rounded bg-primary flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            </div>
            <span className="text-[16px] font-extrabold text-text-primary tracking-tight">
                Cert<span className="text-primary">azy</span>
            </span>
        </Link>
    );
}

function LoginBtn() {
    return (
        <Link
            to="/login"
            className="text-[13.5px] font-medium text-text-secondary hover:text-primary transition-colors duration-200 whitespace-nowrap"
        >
            Log In
        </Link>
    );
}

function RegisterBtn() {
    return (
        <Link
            to="/register"
            className={cn(
                "flex items-center h-[34px] px-5 rounded shrink-0",
                "bg-primary hover:bg-primary-hover",
                "text-[13.5px] font-semibold text-white",
                "transition-colors duration-200 whitespace-nowrap"
            )}
        >
            Sign Up
        </Link>
    );
}

export default NavBarIndex;