"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Plus, Loader2, RotateCcw } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUploadImage } from "@/queries/images/useImages";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import ImagesLibrary from "./images-library";

// Internal unique key for React
function keyid() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Props:
 * - maxFiles: number
 * - onSelectionChange?: (items: Array<{ uuid: string, source: 'library'|'upload', url: string }>) => void
 *   Returns only items that have a server uuid (library items and uploaded items once completed).
 *   Legacy: if you still need the raw File[] for uploads.
 */
export default function ImageDropzone({ currentImages, className, maxFiles = 10, onSelectionChange, ...props }) {
    const queryClient = useQueryClient();
    const [items, setItems] = useState([]);
    const [openLibrary, setOpenLibrary] = useState(false);
    const uploadImage = useUploadImage();
    const oldCurrentImages = useRef(currentImages);

    useEffect(() => {
        if (currentImages && JSON.stringify(oldCurrentImages.current) !== JSON.stringify(currentImages)) {
            setItems(currentImages);
            oldCurrentImages.current = currentImages;
        }
    }, [currentImages]);

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            items.forEach((it) => {
                if (it.kind === "upload" && it.preview && it.preview.startsWith("blob:")) {
                    URL.revokeObjectURL(it.preview);
                }
            });
        };
    }, [items]);

    // Selected output with UUIDs only
    useEffect(() => {
        if (typeof onSelectionChange === "function") {
            const withUuid = items
                .filter((it) => !!it.uuid) // has server uuid
                .map((it) => ({
                    uuid: it.uuid,
                    source: it.kind,
                    url: it.url || it.preview,
                }));
            onSelectionChange(withUuid);
        }
    }, [items]);

    const startUpload = useCallback(
        async (itemKey, file) => {
            const response = await uploadImage.mutateAsync(file);
            if (response) {
                try {
                    const serverUuid = response.uuid;
                    const serverUrl = response.url;
                    setItems((prev) =>
                        prev.map((it) =>
                            it.key === itemKey
                                ? {
                                      ...it,
                                      uuid: serverUuid || it.uuid,
                                      status: "uploaded",
                                      progress: 100,
                                      url: serverUrl || it.url,
                                      error: null,
                                  }
                                : it,
                        ),
                    );
                } catch (err) {
                    setItems((prev) =>
                        prev.map((it) => (it.key === itemKey ? { ...it, status: "error", error: "Response failed from server." } : it)),
                    );
                }
            } else {
                setItems((prev) =>
                    prev.map((it) => (it.key === itemKey ? { ...it, status: "error", error: `Upload failed (HTTP ${xhr.status}).` } : it)),
                );
            }
        },
        [queryClient],
    );

    const queueUploads = useCallback(
        (acceptedFiles) => {
            const slots = Math.max(0, maxFiles - items.length);
            if (slots === 0) return;
            const selected = acceptedFiles.slice(0, slots);

            const newItems = selected.map((file) => ({
                key: keyid(),
                uuid: null,
                kind: "upload",
                file,
                preview: URL.createObjectURL(file),
                status: "uploading",
                progress: 0,
                url: null,
                error: null,
            }));

            setItems((prev) => [...prev, ...newItems]);
            newItems.forEach((it) => startUpload(it.key, it.file));
        },
        [items.length, maxFiles, startUpload],
    );

    const onDrop = useCallback(
        (acceptedFiles) => {
            if (!acceptedFiles?.length) return;
            if (acceptedFiles.some((f) => f.size > 2 * 1024 * 1024)) {
                toast.error("Images must be smaller than 2MB.");
                return;
            }
            queueUploads(acceptedFiles);
        },
        [queueUploads],
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        },
        multiple: true,
        maxFiles,
        noClick: true,
        noKeyboard: true,
    });

    const removeItem = (key) => {
        setItems((prev) => prev.filter((it) => it.key !== key));
    };

    const retryUpload = (key) => {
        const it = items.find((x) => x.key === key);
        if (!it) return;
        setItems((prev) => prev.map((x) => (x.key === key ? { ...x, status: "uploading", progress: 0, error: null } : x)));
        startUpload(key, it.file);
    };

    const emptyState = items.length === 0;

    return (
        <div className={cn("space-y-4", className)} {...props}>
            {/* Hidden input for dropzone */}
            <input {...getInputProps()} className="hidden" />

            {emptyState ? (
                // Large box when no images yet
                <div
                    {...getRootProps({
                        onClick: () => open(),
                    })}
                    className={cn(
                        "border-2 border-dashed rounded-lg py-4 text-center cursor-pointer transition-colors",
                        isDragActive ? "border-primary bg-muted/50" : "border-muted-foreground/25 hover:border-muted-foreground/50",
                    )}
                >
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="flex items-center justify-center w-fit h-16 mb-2 gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    open();
                                }}
                            >
                                Add image
                            </Button>
                            or
                            <button
                                type="button"
                                className="text-primary underline hover:text-primary/80 focus:outline-none w-max"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenLibrary(true);
                                }}
                            >
                                select from library
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">{`Max ${maxFiles} images`}</p>
                    </div>
                </div>
            ) : (
                // Grid of previews + small add box
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" variant="secondary" onClick={() => open()}>
                            Add image
                        </Button>
                        <button
                            type="button"
                            className="text-sm text-primary underline hover:text-primary/80"
                            onClick={() => setOpenLibrary(true)}
                        >
                            Select from library
                        </button>
                        <span className="text-sm text-muted-foreground">{`${items.length}/${maxFiles} ảnh`}</span>
                    </div>

                    <div className="grid grid-cols-10 md:grid-cols-10 lg:grid-cols-10 gap-4">
                        {items.map((it, index) => (
                            <div key={index} className="relative group rounded-md overflow-hidden border border-border">
                                <div className="aspect-square relative">
                                    <Image
                                        src={it.url || it.preview}
                                        alt={`Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />

                                    {/* Upload overlay */}
                                    {it.status === "uploading" && (
                                        <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <span className="text-xs">{`${it.progress || 0}%`}</span>
                                        </div>
                                    )}

                                    {/* Error overlay */}
                                    {it.status === "error" && (
                                        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2 p-3">
                                            <Badge variant="destructive">Upload failed</Badge>
                                            <p className="text-xs text-muted-foreground text-center">{it.error || "Error occurred."}</p>
                                            <Button size="sm" onClick={() => retryUpload(it.key)}>
                                                <RotateCcw className="h-4 w-4 mr-1" />
                                                Retry
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => removeItem(it.key)}
                                    className="absolute top-2 right-2 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label={`Remove ${index + 1}`}
                                    title="Remove image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}

                        {/* Small add box */}
                        {items.length < maxFiles && (
                            <div
                                {...getRootProps({
                                    onClick: () => open(),
                                })}
                                className={cn(
                                    "border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors",
                                    isDragActive
                                        ? "border-primary bg-muted/50"
                                        : "border-muted-foreground/25 hover:border-muted-foreground/50",
                                )}
                            >
                                <Plus className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ImagesLibrary
                selectedImages={items}
                open={openLibrary}
                onOpenChange={setOpenLibrary}
                maxFiles={maxFiles}
                onSelectImage={setItems}
            />
        </div>
    );
}

ImageDropzone.defaultProps = {
    className: "",
    maxFiles: 10,
    getAuthToken: undefined,
    onSelectionChange: undefined,
};
