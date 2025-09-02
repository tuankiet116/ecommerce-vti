"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageDropzone from "./ImageDropzone";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useGetImages } from "@/queries/images/useImages";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ChevronsLeft } from "lucide-react";
import { ChevronsRight } from "lucide-react";
import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ImageLibrary({ initSelectedImages, open, onOpenChange, onSelectImage, isMultiple = false }) {
    const [page, setPage] = useState(1);
    const [selectedImages, setSelectedImages] = useState(initSelectedImages || []);
    const { data: libData, isLoading: libLoading, isFetching: libFetching } = useGetImages(page);

    useEffect(() => {
        setSelectedImages(initSelectedImages || []);
    }, [initSelectedImages, open]);

    const totalPages = libData?.last_page ?? 1;
    const totalItems = libData?.total ?? 0;
    const libraryItems = libData?.data ?? [];

    const handleSelectImageLibrary = (image) => {
        if (!image) {
            return;
        }

        const isSelected = selectedImages.some((it) => it.uuid === image.uuid);

        if (isMultiple) {
            if (isSelected) {
                setSelectedImages((prev) => prev.filter((it) => it.uuid !== image.uuid));
            } else {
                setSelectedImages((prev) => [...prev, image]);
            }
        } else {
            setSelectedImages([image]);
        }
    };

    const handleConfirmSelection = () => {
        if (selectedImages.length > 0) {
            onSelectImage(
                selectedImages.map((image) => ({
                    key: image.uuid,
                    uuid: image.uuid,
                    kind: "library",
                    file: undefined,
                    status: "selected",
                    progress: 100,
                    url: image.url,
                    error: null,
                })),
            );
            onOpenChange(false);
        } else {
            toast.error("Please select at least one image.");
        }
    };

    const goFirst = () => setPage(1);
    const goPrev = () => setPage((p) => Math.max(1, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
    const goLast = () => setPage(totalPages);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Images Library</DialogTitle>
                    <DialogDescription>
                        {isMultiple ? "Select multiple images from your library" : "Select an image from your library"}
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full">
                    <ImageDropzone />
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4 min-h-[320px]">
                        {(libLoading || libFetching) &&
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={`sk-${i}`} className="space-y-2" aria-hidden="true">
                                    <div className="aspect-square rounded-lg border animate-pulse bg-muted/60" />
                                    <div className="h-4 bg-muted/60 rounded animate-pulse" />
                                </div>
                            ))}

                        {!libLoading &&
                            libraryItems.map((lib) => {
                                const isSelected = selectedImages.some((img) => img.uuid === lib.uuid);
                                return (
                                    <div key={lib.uuid} className="space-y-2">
                                        <button
                                            type="button"
                                            className={cn(
                                                "aspect-square relative border-2 rounded-lg hover:border-primary transition-all duration-200 overflow-hidden group w-full",
                                                "hover:shadow-xl hover:scale-[1.03]",
                                                isSelected
                                                    ? "border-primary ring-2 ring-primary/20 shadow-xl"
                                                    : "border-border hover:border-primary/50",
                                            )}
                                            onClick={() => handleSelectImageLibrary(lib)}
                                            aria-label={`Select image ${lib.name || lib.uuid}`}
                                            title={`Select image: ${lib.name || lib.uuid}`}
                                        >
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={lib.url || "/placeholder.svg"}
                                                    alt={`Image: ${lib.name || lib.uuid}`}
                                                    fill
                                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                />

                                                <div
                                                    className={cn(
                                                        "absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200",
                                                        isSelected && "opacity-100",
                                                    )}
                                                />

                                                <div
                                                    className={cn(
                                                        "absolute top-3 right-3 w-7 h-7 rounded-full border-2 bg-white/90 backdrop-blur-sm transition-all duration-200 flex items-center justify-center",
                                                        isSelected
                                                            ? "border-primary bg-primary text-primary-foreground"
                                                            : "border-white/60 group-hover:border-primary/60",
                                                    )}
                                                >
                                                    {isSelected && <Check className="w-4 h-4" />}
                                                </div>
                                            </div>
                                        </button>

                                        <div className="text-center">
                                            <p
                                                className="text-sm font-medium text-foreground truncate"
                                                title={lib.name || `Image ${lib.uuid}`}
                                            >
                                                {lib.name || `Image ${lib.uuid}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {lib.size ? `${(lib.size / 1024 / 1024).toFixed(1)}MB` : "Unknown size"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        {`Page ${page} of ${totalPages} • ${totalItems} images`}
                        {selectedImages.length > 0 && (
                            <span className="ml-2 text-primary font-medium">• {selectedImages.length} selected</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={goFirst} disabled={page === 1}>
                            <ChevronsLeft className="h-4 w-4" />
                            <span className="sr-only">First page</span>
                        </Button>
                        <Button type="button" variant="outline" size="icon" onClick={goPrev} disabled={page === 1}>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button>
                        <Button type="button" variant="outline" size="icon" onClick={goNext} disabled={page === totalPages}>
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </Button>
                        <Button type="button" variant="outline" size="icon" onClick={goLast} disabled={page === totalPages}>
                            <ChevronsRight className="h-4 w-4" />
                            <span className="sr-only">Last page</span>
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSelection} disabled={selectedImages.length === 0} className="min-w-[120px]">
                        Select {selectedImages.length > 0 && `(${selectedImages.length})`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
