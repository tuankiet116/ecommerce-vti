import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetImages } from "@/queries/images/useImages";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronsLeft } from "lucide-react";
import { ChevronsRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ImagesLibrary({ selectedImages, onSelectImage, open, onOpenChange, maxFiles = 10 }) {
    const [page, setPage] = useState(1);
    const { data: libData, isLoading: libLoading, isFetching: libFetching } = useGetImages(page);

    const totalPages = libData?.last_page ?? 1;
    const totalItems = libData?.total ?? 0;
    const libraryItems = libData?.data ?? [];

    const handleSelectImageLibrary = (image) => {
        if (!image) {
            toast.error("No image selected.");
            return;
        }

        if (selectedImages.some((it) => it.uuid === image.uuid)) {
            toast.error("This image is already selected.");
            return;
        }
        const slots = Math.max(0, maxFiles - selectedImages.length);
        if (slots <= 0) {
            toast.error("Maximum number of images reached.");
            return;
        }

        onSelectImage((prev) => [
            ...prev,
            {
                key: image.uuid,
                uuid: image.uuid, // server uuid
                kind: "library",
                file: undefined,
                status: "selected",
                progress: 100,
                url: image.url,
                error: null,
            },
        ]);

        onOpenChange(false);
    };

    const goFirst = () => setPage(1);
    const goPrev = () => setPage((p) => Math.max(1, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
    const goLast = () => setPage(totalPages);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                onOpenChange(open);
                if (open) setPage(1);
            }}
        >
            <DialogContent className="sm:max-w-[1020px]">
                <DialogHeader>
                    <DialogTitle>Image library</DialogTitle>
                    <DialogDescription>Select existing image to use.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-12 gap-2 py-4 min-h-[320px]">
                    {(libLoading || libFetching) &&
                        Array.from({ length: 9 }).map((_, i) => (
                            <div key={`sk-${i}`} className="aspect-square rounded-md border animate-pulse bg-muted/60" aria-hidden="true" />
                        ))}

                    {!libLoading &&
                        libraryItems.map((lib) => (
                            <button
                                key={lib.uuid}
                                type="button"
                                className="aspect-square relative border rounded-md hover:border-primary transition-colors overflow-hidden w-20 h-20"
                                onClick={() => handleSelectImageLibrary(lib)}
                                aria-label={`Select image ${lib.uuid}`}
                                title={`Select #${lib.uuid}`}
                            >
                                <Image
                                    src={lib.url}
                                    alt={`Image library ${lib.uuid}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 100px) 10vw, 100px"
                                />
                            </button>
                        ))}
                </div>

                {/* Pagination controls */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{`Page ${page} / ${totalPages} • ${totalItems} images`}</div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={goFirst}
                            disabled={page === 1}
                            className="cursor-pointer"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                            <span className="sr-only">First page</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={goPrev}
                            disabled={page === 1}
                            className="cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={goNext}
                            disabled={page === totalPages}
                            className="cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={goLast}
                            disabled={page === totalPages}
                            className="cursor-pointer"
                        >
                            <ChevronsRight className="h-4 w-4" />
                            <span className="sr-only">Last page</span>
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
