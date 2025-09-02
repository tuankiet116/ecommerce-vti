"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Input = React.forwardRef(
    (
        {
            className,
            type,
            error,
            showErrorAsTooltip = false, // Added prop to control error display mode
            ...props
        },
        ref,
    ) => {
        const hasError = !!error;

        return (
            <div className="w-full relative">
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            type === "number" &&
                                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                            hasError && "border-red-500 focus-visible:ring-red-500",
                            hasError && showErrorAsTooltip && "pr-9", // Extra padding for error icon
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />

                    {hasError && showErrorAsTooltip && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs">
                                        <p className="text-sm">{error}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                </div>

                {hasError && !showErrorAsTooltip && <div className="text-red-500 text-sm mt-1">{error}</div>}
            </div>
        );
    },
);
Input.displayName = "Input";

export { Input };
