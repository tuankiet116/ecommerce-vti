"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * MultiSelect Component - A searchable multi-selection dropdown with filtering capabilities
 *
 * @param {Object} props - Component props
 * @param {Array} props.options - Array of option objects with structure: { id: string|number, label: string, value: string, description?: string }
 * @param {Array} props.selected - Array of currently selected option objects
 * @param {Function} props.onSelectionChange - Callback function called when selection changes, receives array of selected objects
 * @param {string} [props.placeholder="Select items..."] - Placeholder text when no items are selected
 * @param {string} [props.searchPlaceholder="Search items..."] - Placeholder text for search input
 * @param {string} [props.className] - Additional CSS classes to apply to the component
 * @param {boolean} [props.disabled=false] - Whether the component is disabled
 * @param {number} [props.maxSelected] - Maximum number of items that can be selected
 * @param {Function} [props.onSearch] - Optional callback for custom search handling, receives search term string
 * @param {boolean} [props.loading=false] - Whether the component is in loading state
 * @param {string} [props.emptyText="No items found."] - Text to display when no options match the search
 */
export function MultiSelect({
    options,
    selected,
    onSelectionChange,
    placeholder = "Select items...",
    searchPlaceholder = "Search items...",
    className,
    disabled = false,
    maxSelected,
    onSearch,
    loading = false,
    emptyText = "No items found.",
}) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    // Filter options based on search term
    const filteredOptions = React.useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(
            (option) =>
                String(option.label).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(option.value).toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [options, searchTerm]);

    // Handle search input change
    const handleSearch = (value) => {
        setSearchTerm(value);
        onSearch?.(value);
    };

    // Toggle selection of an option
    const toggleOption = (option) => {
        const isSelected = selected.some((item) => item.id === option.id);

        if (isSelected) {
            // Remove from selection
            onSelectionChange(selected.filter((item) => item.id !== option.id));
        } else {
            // Add to selection (check max limit)
            if (maxSelected && selected.length >= maxSelected) {
                return;
            }
            onSelectionChange([...selected, option]);
        }
    };

    // Remove specific item from selection
    const removeOption = (optionId) => {
        onSelectionChange(selected.filter((item) => item.id !== optionId));
    };

    // Clear all selections
    const clearAll = () => {
        onSelectionChange([]);
    };

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between min-h-10 h-auto p-2 bg-transparent"
                        disabled={disabled}
                    >
                        <div className="flex flex-wrap gap-1 flex-1">
                            {selected.length === 0 ? (
                                <span className="text-muted-foreground">{placeholder}</span>
                            ) : (
                                selected.map((option) => (
                                    <Badge key={option.id} variant="secondary" className="text-xs">
                                        {option.label}
                                        <div
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer inline-flex"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    removeOption(option.id);
                                                }
                                            }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeOption(option.id);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </div>
                                    </Badge>
                                ))
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {selected.length > 0 && (
                                <div
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        clearAll();
                                    }}
                                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                >
                                    <X className="h-4 w-4" />
                                </div>
                            )}
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} value={searchTerm} onValueChange={handleSearch} />
                        <CommandList>
                            <CommandEmpty>{loading ? "Loading..." : emptyText}</CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option) => {
                                    const isSelected = selected.some((item) => item.id === option.id);
                                    const isDisabled = maxSelected && !isSelected && selected.length >= maxSelected;

                                    return (
                                        <CommandItem
                                            key={option.id}
                                            value={option.value}
                                            onSelect={() => !isDisabled && toggleOption(option)}
                                            className={cn("cursor-pointer", isDisabled && "opacity-50 cursor-not-allowed")}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                                            <div className="flex-1">
                                                <div className="font-medium">{option.label}</div>
                                                {option.description && (
                                                    <div className="text-sm text-muted-foreground">{option.description}</div>
                                                )}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {maxSelected && (
                <div className="text-xs text-muted-foreground mt-1">
                    {selected.length}/{maxSelected} selected
                </div>
            )}
        </div>
    );
}
