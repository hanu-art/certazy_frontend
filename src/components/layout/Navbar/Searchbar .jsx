import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SearchBar.jsx
 *
 * Real project mein:
 *   onChange → dispatch(setSearchQuery(value))
 *   useDebounce hook lagao — GET /api/v1/courses?search=
 */
export default function SearchBar({ className }) {
    const [focused, setFocused] = useState(false);

    return (
        <div
            className={cn(
                "flex items-center gap-2 h-[38px] px-3 flex-1",
                "bg-page border border-border rounded",
                "transition-all duration-200",
                focused && "bg-white border-primary shadow-[0_0_0_3px_#EBF4FB]",
                className
            )}
        >
            <Search
                size={15}
                className={cn(
                    "shrink-0 transition-colors duration-200",
                    focused ? "text-primary" : "text-text-muted"
                )}
            />
            <input
                type="text"
                placeholder="What do you want to learn?"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13.5px] font-normal text-text-primary placeholder:text-text-muted font-sans"
            />
        </div>
    );
}