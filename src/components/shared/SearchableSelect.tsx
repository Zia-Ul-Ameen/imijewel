'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options?: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => Promise<Option[]>;
    isLoading?: boolean;
    disabled?: boolean;
    error?: string;
}

export function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = 'Select item...',
    className,
    onSearch,
    isLoading = false,
    disabled = false,
    error,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<Option[]>(options);
    const [isSearching, setIsSearching] = React.useState(false);
    const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

    // Handle search with debouncing
    React.useEffect(() => {
        if (!onSearch) {
            // Client-side filtering
            const filtered = options.filter((option) =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
            return;
        }

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Server-side search with debouncing
        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await onSearch(searchQuery);
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, onSearch, options]);

    const handleSelect = (itemValue: string) => {
        onChange(itemValue);
        setOpen(false);
    };

    const selectedOption = React.useMemo(() => {
        // First check search results, then check initial options
        return searchResults.find((opt) => opt.value === value) || options.find((opt) => opt.value === value);
    }, [value, searchResults, options]);

    return (
        <div className={cn('relative w-full', className)}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between bg-transparent font-normal h-auto p-3 rounded-lg border-zinc-200",
                            !value && "text-muted-foreground",
                            error && "border-red-500"
                        )}
                        disabled={isLoading || disabled}
                    >
                        <span className="truncate">
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading...
                                </span>
                            ) : selectedOption ? (
                                selectedOption.label
                            ) : (
                                placeholder
                            )}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-0" align="start">
                    <div className="flex items-center border-b px-3" onClick={(e) => e.stopPropagation()}>
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                // Prevent dropdown from closing when typing
                                e.stopPropagation();
                            }}
                            className="flex h-11 w-full rounded-lg bg-white py-3 text-base md:text-sm outline-none border border-zinc-200 focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black transition-all"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1">
                        {isSearching ? (
                            <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Searching...
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No results found.
                            </div>
                        ) : (
                            searchResults.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    {option.label}
                                    {value === option.value && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
