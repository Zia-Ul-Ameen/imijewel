'use client';

import * as React from 'react';
import { X, Check, ChevronsUpDown, Search, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

interface MultiSelectProps {
    options?: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => Promise<Option[]>;
    isLoading?: boolean;
    selectedOptions?: Option[]; // Pre-loaded selected options for editing
}

export function MultiSelect({
    options = [],
    selected,
    onChange,
    placeholder = 'Select items...',
    className,
    onSearch,
    isLoading = false,
    selectedOptions = [],
}: MultiSelectProps) {
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
    }, [searchQuery, onSearch]);

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item));
    };

    const handleSelect = (item: string) => {
        if (selected.includes(item)) {
            onChange(selected.filter((i) => i !== item));
        } else {
            onChange([...selected, item]);
        }
    };

    // Get selected items - combine search results with pre-loaded selected options
    const allOptions = onSearch ? searchResults : options;
    // Merge selectedOptions with allOptions, removing duplicates
    const mergedOptions = [...selectedOptions];
    allOptions.forEach(opt => {
        if (!mergedOptions.find(o => o.value === opt.value)) {
            mergedOptions.push(opt);
        }
    });
    const selectedItems = mergedOptions.filter((option) => selected.includes(option.value));

    return (
        <div className={cn('relative w-full', className)}>
            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {selectedItems.map((option) => (
                        <Badge
                            key={option.value}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {option.label}
                            <button
                                type="button"
                                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUnselect(option.value);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(option.value)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-transparent font-normal"
                        disabled={isLoading}
                    >
                        <span className="truncate">
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading...
                                </span>
                            ) : selected.length > 0 ? (
                                `${selected.length} selected`
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
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0"
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
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        handleSelect(option.value);
                                    }}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    {option.label}
                                    {selected.includes(option.value) && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
