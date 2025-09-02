import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect } from "react";
import { set } from "date-fns";

export default function EditCategory({ selectedCategory, open, errors, onSave, onClose }) {
    const [category, setCategory] = useState();

    const handleChange = (field, e) => {
        const value = e.target.value;
        setCategory((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (category) {
            onSave(category);
        }
        setCategory({ name: "", description: "" });
    };

    useEffect(() => {
        setCategory(selectedCategory || { name: "", description: "" });
    }, [selectedCategory]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedCategory ? "Update category" : "Create category"}</DialogTitle>
                    <DialogDescription>
                        {selectedCategory ? "Update the details of the selected category." : "Fill in the details to create a new category."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="name">Category name</Label>
                        <Input id="name" value={category?.name} onChange={(e) => handleChange("name", e)} />
                        {errors?.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={category?.description} onChange={(e) => handleChange("description", e)} />
                        {errors?.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleSave}>{selectedCategory ? "Update" : "Create"}</Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
