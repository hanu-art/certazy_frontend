import { Link } from "react-router-dom";
import { ChevronDown, Info, Mail, HelpCircle, BookOpen } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ── Icons for each item ───────────────────────────────────
const MORE_ITEMS = [
    { label: "About Us", to: "/about", icon: Info, desc: "Our story and mission" },
    { label: "Contact", to: "/contact", icon: Mail, desc: "Get in touch with us" },
    { label: "Blog", to: "/blog", icon: BookOpen, desc: "Tips, guides and resources" },
    { divider: true },
    { label: "Help Center", to: "/help", icon: HelpCircle, desc: "FAQs and support" },
];

export default function NavLinks() {
    return (
        <nav className="hidden md:flex items-center gap-6">
            <MoreDropdown />
        </nav>
    );
}

// ── Single nav link with underline animation ──────────────
export function NavLink({ label, to }) {
    return (
        <Link
            to={to}
            className={cn(
                "relative text-[14px] font-medium text-text-secondary",
                "hover:text-primary transition-colors duration-200",
                "py-1 group whitespace-nowrap"
            )}
        >
            {label}
            <span className="absolute bottom-0  left-0 h-[2px] w-0 bg-primary rounded-full transition-all duration-200 group-hover:w-full" />
        </Link>
    );
}

// ── More dropdown ─────────────────────────────────────────
function MoreDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    "flex items-center gap-1 text-[14px] font-medium outline-none",
                    "text-text-secondary hover:text-primary transition-colors duration-200",
                    "data-[state=open]:text-primary"
                )}
            >
                More
                <ChevronDown
                    size={13}
                    className="transition-transform duration-200 data-[state=open]:rotate-180"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="w-[220px] rounded-lg shadow-drop border-border p-1.5"
            >
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
                                {/* Icon */}
                                <div className={cn(
                                    "w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5",
                                    "bg-page group-hover:bg-white transition-colors duration-150"
                                )}>
                                    <item.icon
                                        size={14}
                                        className="text-text-muted group-hover:text-primary transition-colors duration-150"
                                    />
                                </div>

                                {/* Label + desc */}
                                <div>
                                    <p className="text-[13.5px] font-semibold text-text-primary group-hover:text-primary transition-colors duration-150">
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