import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Info, Mail, HelpCircle, BookOpen } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MORE_ITEMS = [
    { label: "About Us", to: "/about", icon: Info, desc: "Our story and mission" },
    { label: "Contact", to: "/contact", icon: Mail, desc: "Get in touch with us" },
    { label: "Blog", to: "/blog", icon: BookOpen, desc: "Tips, guides and resources" },
    { divider: true },
    { label: "Help Center", to: "/help", icon: HelpCircle, desc: "FAQs and support" },
];

export default function NavLinks({ megaOpen, onToggleMega }) {
    const { pathname } = useLocation();

    return (
        
        <nav className="flex items-center gap-10">
            <NavLink to="/" label="Home" isActive={pathname === "/"} />
            <AllCoursesLink isOpen={megaOpen} onClick={onToggleMega} />
            <MoreDropdown />
        </nav>
    );
}

// ── Base nav link ─────────────────────────────────────────
function NavLink({ to, label, isActive }) {
    return (
        <Link
            to={to}
            className={cn(
                "relative flex items-center h-[70px]",
                "text-[13.5px] font-medium transition-colors duration-200 group whitespace-nowrap",
                isActive ? "text-primary" : "text-text-secondary hover:text-primary"
            )}
        >
            {label}
            <span className={cn(
                "absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-sm transition-all duration-200",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />
        </Link>
    );
}

// ── All Courses ───────────────────────────────────────────
function AllCoursesLink({ isOpen, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-1 h-[60px] outline-none",
                "text-[13.5px] font-medium transition-colors duration-200 group whitespace-nowrap",
                isOpen ? "text-primary" : "text-text-secondary hover:text-primary"
            )}
        >
            All Courses
            <ChevronDown
                size={13}
                className={cn("transition-transform duration-200", isOpen && "rotate-180")}
            />
            <span className={cn(
                "absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-sm transition-all duration-200",
                isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />
        </button>
    );
}

// ── More dropdown ─────────────────────────────────────────
function MoreDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn(
                    "relative flex items-center gap-1 h-[60px] outline-none",
                    "text-[13.5px] font-medium transition-colors duration-200 group whitespace-nowrap",
                    "text-text-secondary hover:text-primary data-[state=open]:text-primary"
                )}>
                    More
                    <ChevronDown size={13} className="transition-transform duration-200 data-[state=open]:rotate-180" />
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] w-full bg-primary rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-[220px]  rounded-lg shadow-drop border-border p-1.5">
                {MORE_ITEMS.map((item, i) =>
                    item.divider ? (
                        <DropdownMenuSeparator key={i} className="bg-border my-1" />
                    ) : (
                        <DropdownMenuItem key={i} asChild>
                            <Link
                                to={item.to}
                                className={cn(
                                    "flex items-start gap-3 px-3 py-2.5 rounded cursor-pointer",
                                    "hover:bg-primary-light group transition-colors duration-150",
                                    "outline-none focus:bg-primary-light"
                                )}
                            >
                                <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 bg-page group-hover:bg-white transition-colors duration-150">
                                    <item.icon size={14} className="text-text-muted group-hover:text-primary transition-colors duration-150" />
                                </div>
                                <div>
                                    <p className="text-[13.5px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                                        {item.label}
                                    </p>
                                    <p className="text-[12px] text-text-muted mt-0.5 leading-tight">
                                        {item.desc}
                                    </p>
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    )
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}