import { Button } from "../ui/button";

export default function DefaultPage({ children, hasUnsavedChanges, isSaving, onDiscard, onSave }) {
    return (
        <>
            <div className="flex flex-1 flex-col gap-4 pt-0 w-full min-h-dvh relative">{children}</div>
            <div className="sticky bottom-0 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-lg">
                <div className="mx-auto max-w-4xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {hasUnsavedChanges && (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    <span>Unsaved changes</span>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={onDiscard} disabled={isSaving} className="min-w-[100px] bg-transparent">
                                {hasUnsavedChanges ? "Discard" : "Cancel"}
                            </Button>

                            <Button onClick={onSave} disabled={isSaving || !hasUnsavedChanges} className="min-w-[140px] gap-2">
                                {isSaving ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save setting"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
