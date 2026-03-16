import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MORE_ITEMS } from "./navbar.data";
import { cn } from "@/lib/utils";

/**
 * NavLinks.jsx
 * Desktop nav — More dropdown only
 * "All Courses" button alag hai index.jsx mein (MegaMenu trigger)
 */
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
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary rounded-full transition-all duration-200 group-hover:w-full" />
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
                className="min-w-[180px] rounded-lg shadow-drop border-border p-1"
            >
                {MORE_ITEMS.map((item, i) =>
                    item.divider ? (
                        <DropdownMenuSeparator key={i} className="bg-border my-1" />
                    ) : (
                        <DropdownMenuItem key={i} asChild>
                            <Link
                                to={item.to}
                                className="text-[13.5px] font-medium text-text-primary cursor-pointer w-full rounded"
                            >
                                {item.label}
                            </Link>
                        </DropdownMenuItem>
                    )
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}