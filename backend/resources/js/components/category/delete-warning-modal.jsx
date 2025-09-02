import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export default function DeleteWarningModal({ open, selectedCategory, onClose, onDelete }) {
    const handleDelete = () => {
        onDelete(selectedCategory);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogDescription>
                        If you delete this category, all subcategory will also be removed and products accociated with this category will be
                        detached. This action cannot be undone. Are you sure you want to delete this category?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
