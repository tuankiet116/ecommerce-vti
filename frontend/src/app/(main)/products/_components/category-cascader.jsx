"use client";

import { ArrowLeft, ChevronRight, Check, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useGetCategories } from "@/queries/products/useCategories";

export default function CategoryCascader({
    selected = [], // selected path (controlled from parent)
    onChange,
    placeholder,
    emptyText,
}) {
    const [parentId, setParentId] = useState(null);
    const { data: categories, isLoading: loading } = useGetCategories(parentId);
    const [open, setOpen] = useState(false);

    const [browsePath, setBrowsePath] = useState([]);

    const selectedLabel = selected.length ? selected.map((n) => n.name).join(" / ") : "";

    // When dialog opens, decide where to start browsing:
    // - If selected leaf exists, show its parent list (with the leaf marked selected)
    // - Else if selected node has children, show its children
    // - Else show root
    useEffect(() => {
        if (!open) return;
        const last = selected[selected.length - 1];
        if (!last) {
            setBrowsePath([]);
            return;
        }
        if (last.hasChildren) {
            // selected node is a parent → keep it as current parent in view
            setBrowsePath(selected);
        } else {
            // selected node is a leaf → browse at its parent list
            setBrowsePath(selected.slice(0, -1));
        }
    }, [open, selected]);

    useEffect(() => {
        const browseParentId = browsePath.length ? browsePath[browsePath.length - 1].id : null;
        setParentId(browseParentId);
    }, [browsePath]);

    const goDeeper = (node) => {
        if (node.hasChildren) {
            setBrowsePath((p) => [...p, node]);
        } else {
            const newSelected = [...browsePath, node];
            onChange(newSelected);
            setOpen(false);
        }
    };

    const goBack = () => {
        if (!browsePath.length) return;
        setBrowsePath((p) => p.slice(0, -1));
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        onChange?.([]);
    };

    // Determine which item is the currently selected leaf (for checkmark highlight)
    const selectedLeafId = selected.length && selected.find((n) => !n.hasChildren && !!n.parent_id)?.id;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                        "w-full h-10 px-3 rounded-md border flex items-center justify-between",
                        "bg-background hover:bg-accent/30 cursor-pointer",
                        !selectedLabel && "text-muted-foreground",
                    )}
                    title={selectedLabel || placeholder}
                >
                    <span className="truncate">{selectedLabel || placeholder}</span>
                    {!!selected.length && (
                        <button
                            aria-label="Xóa lựa chọn"
                            className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-accent"
                            onClick={clearSelection}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </DialogTrigger>

            <DialogContent className="p-0 gap-0 sm:max-w-lg">
                <DialogHeader className="p-4 border-b">
                    <div className="flex items-center gap-2">
                        <button
                            className={cn(
                                "h-8 w-8 inline-flex items-center justify-center rounded hover:bg-accent",
                                browsePath.length ? "opacity-100" : "opacity-0 pointer-events-none",
                            )}
                            onClick={goBack}
                            aria-label="Quay lại"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <DialogTitle className="truncate">
                            {browsePath.length ? browsePath[browsePath.length - 1].name : "Chọn danh mục"}
                        </DialogTitle>
                    </div>
                    {!!browsePath.length && (
                        <div className="text-xs text-muted-foreground px-10 pt-1 truncate">{browsePath.map((n) => n.name).join(" / ")}</div>
                    )}
                </DialogHeader>

                <div className="p-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </div>
                    ) : categories?.length ? (
                        <ScrollArea className="max-h-[400px]">
                            <ul role="listbox" aria-label="Product categories" className="divide-y">
                                {categories.map((item) => {
                                    const isSelected = item.id === selectedLeafId;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                type="button"
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-3 rounded-md",
                                                    "hover:bg-accent",
                                                    isSelected && "bg-accent",
                                                )}
                                                onClick={() => goDeeper(item)}
                                                aria-selected={isSelected ? "true" : "false"}
                                                aria-haspopup={item.hasChildren ? "listbox" : undefined}
                                            >
                                                <span className={cn("text-left", isSelected && "font-medium")}>{item.name}</span>
                                                {item.hasChildren ? (
                                                    <ChevronRight className="h-4 w-4 opacity-60" />
                                                ) : (
                                                    <Check className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-30")} />
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </ScrollArea>
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-12">{emptyText}</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
