"use client";

import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useUploadImage } from "@/queries/images/useImages";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

function keyid() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function ImageDropzone() {
    const queryClient = useQueryClient();
    const uploadImage = useUploadImage();
    const [images, setImages] = useState([]);

    const startUpload = useCallback(
        async (itemKey, file) => {
            const response = await uploadImage.mutateAsync(file).catch((err) => {
                console.error("Image upload error:", err);
                return null;
            });

            if (response) {
                const serverUuid = response.uuid;
                const serverUrl = response.url;
                setImages((prev) =>
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
                queryClient.invalidateQueries(["images"]);
            } else {
                toast.error("Image upload failed.");
            }
        },
        [queryClient, uploadImage],
    );

    const queueUploads = useCallback(
        (acceptedFiles) => {
            const newImages = acceptedFiles.map((file) => ({
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

            setImages((prev) => [...prev, ...newImages]);
            newImages.forEach((it) => startUpload(it.key, it.file));
        },
        [images.length, startUpload],
    );

    const handleDrop = useCallback(
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
        onDrop: handleDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        },
        multiple: true,
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps({
                    onClick: () => open(),
                })}
                className={cn("border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-primary/50")}
            >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                    <p className="text-lg font-medium">Drop images here or click to upload</p>
                    <p className="text-sm text-muted-foreground">Support for PNG, JPG, GIF up to 10MB</p>
                </div>
                <input {...getInputProps()} className="hidden" />
            </div>
        </div>
    );
}
