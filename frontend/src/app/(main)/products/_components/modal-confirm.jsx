import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ModalConfirm({ open, header, children, buttonConfirmText, buttonConfirmVariant, onConfirm, onOpenChange, isLoading }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{header}</DialogTitle>
                    
                </DialogHeader>
                {children}
                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant={buttonConfirmVariant} onClick={() => onConfirm()} disabled={isLoading}>
                        {isLoading ? "Processing..." : buttonConfirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
