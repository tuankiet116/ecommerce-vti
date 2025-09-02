import EditCategoryModal from "@/components/category/edit-category-modal";
import { useCreateCategory, useDeleteCategory, useGetCatergories, useUpdateCategory } from "@/api/useCategory";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/ultils/site-header";
import { PlusCircle } from "lucide-react";
import { Trash2Icon } from "lucide-react";
import { Plus, Pencil, Folder, FileText } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { Loader } from "lucide-react";
import { queryClient } from "@/api";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";
import DeleteWarningModal from "@/components/category/delete-warning-modal";

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [errors, setErrors] = useState(null);

    const [parentId, setParentId] = useState(null);
    const [newCategory, setNewCategory] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();
    const { data: dataCategories, isLoading, refetch } = useGetCatergories(parentId);

    useEffect(() => {
        queryClient.invalidateQueries(["getCategories"]);
    }, []);

    const getSubCategories = (categories, parentId) => {
        let subCategories = [];
        categories?.forEach((category) => {
            if (category.id === parentId) {
                subCategories = category.children ?? [];
            } else if (category?.children) {
                subCategories = getSubCategories(category?.children, parentId);
            }
        });
        return subCategories;
    };

    const setSubCategories = (categories, parentId, subCategories) => {
        if (!parentId) {
            return [...categories, ...subCategories]; // If no parentId, just append subCategories to the root categories
        }

        let newCategories = categories.map((category) => {
            if (category.id === parentId) {
                return { ...category, hasChildren: !!subCategories.length, children: subCategories };
            } else if (category?.children) {
                return { ...category, children: setSubCategories(category?.children, parentId, subCategories) };
            }
            return category;
        });
        return newCategories;
    };

    useEffect(() => {
        if (!dataCategories) return;

        if (!parentId) {
            setCategories((prev) => {
                const isSame = JSON.stringify(prev) === JSON.stringify(dataCategories);
                if (isSame) return prev;
                return dataCategories;
            });
            return;
        }

        let currentCategory = getSubCategories(categories, parentId);
        if (currentCategory && currentCategory.length > 0) {
            return;
        }

        if (dataCategories && dataCategories.length > 0) {
            let newCategories = setSubCategories(categories, parentId, dataCategories);
            setCategories(newCategories);
        }
    }, [parentId, dataCategories]);

    const handleAddCategory = (e, parentId = null) => {
        e.stopPropagation();
        setNewCategory({
            parent_id: parentId,
        });
        setOpenModalEdit(true);
    };

    const handleOpenModalEditing = (e, category) => {
        e.stopPropagation();
        setEditingCategory(category);
        setOpenModalEdit(true);
    };

    const handleOpenModalDelete = (e, category) => {
        e.stopPropagation();
        setEditingCategory(category);
        setOpenModalDelete(true);
    };

    const handleCloseModalEdit = () => {
        setOpenModalEdit(false);
        setNewCategory(null);
        setEditingCategory(null);
    };

    const handleCloseModalDelete = () => {
        setOpenModalDelete(false);
        setNewCategory(null);
        setEditingCategory(null);
    };

    const handleRemoveCategory = (category) => {
        deleteCategory.mutate(category.id, {
            onSuccess: (res) => {
                if (category.parent_id) {
                    let subCategories = getSubCategories(categories, category.parent_id);
                    subCategories = subCategories.filter((cat) => cat.id != category.id);
                    let newCategories = setSubCategories(categories, category.parent_id, subCategories);
                    setCategories(newCategories);
                } else {
                    let newCategories = categories.filter((cat) => cat.id != category.id);
                    setCategories(newCategories);
                }
                refetch();
                setEditingCategory(null);
                setOpenModalDelete(false);
                toast.success("Deleted");
            },
            onError: (error) => {
                console.error("Failed to delete category:", error);
            },
        });
    };

    const handleCreateCategory = async (category) => {
        const response = await createCategory.mutateAsync({ ...category, ...newCategory });

        if (response) {
            setCategories((prev) => {
                let subCategories = [];
                if (response.parent_id) {
                    subCategories = getSubCategories(prev, response.parent_id);
                    subCategories.unshift(response);
                    let newCategories = setSubCategories(prev, response.parent_id, subCategories);
                    return newCategories;
                }
                return [response, ...prev]; // If no parent_id, add to root categories
            });
        }
    };

    const handleUpdateCategory = async (category) => {
        const categoryId = editingCategory?.id || category.id;
        const response = await updateCategory.mutateAsync({ categoryId, category });

        if (response) {
            setCategories((prev) => {
                let subCategories = [];
                if (response.parent_id) {
                    subCategories = getSubCategories(prev, response.parent_id);
                    subCategories = subCategories.map((subCat) => (subCat.id === response.id ? response : subCat));
                    let newCategories = setSubCategories(prev, response.parent_id, subCategories);
                    return newCategories;
                }
                return prev.map((cat) => (cat.id === response.id ? Object.assign(cat, response) : cat)); // Update the category in root categories
            });
        }
    };

    const handleSaveCategory = async (category) => {
        try {
            if (editingCategory) {
                await handleUpdateCategory(category);
            } else {
                await handleCreateCategory(category);
            }
            toast.success("Settings saved.");
            setErrors(null);
            setOpenModalEdit(false);
            setEditingCategory(null);
            refetch();
        } catch (error) {
            toast.error("An error occurred while saving the category.");
            if (error.status === HttpStatusCode.UnprocessableEntity) {
                setErrors(error.response.data.errors || {});
            }
        }
    };

    const Item = ({ category, level = 0 }) => {
        const indentStyle = {
            paddingLeft: `${level * 20}px`,
        };

        return (
            <AccordionItem
                value={category.id}
                onClick={(e) => {
                    e.stopPropagation();
                    setParentId(category.id);
                }}
                className="border-none my-1 py-0 group"
            >
                <AccordionTrigger
                    className={`cursor-pointer items-center py-1 hover:bg-gray-50`}
                    chervDownClassName={{ "opacity-0": !category.hasChildren }}
                    style={indentStyle}
                >
                    <div className="flex items-center justify-between gap-2 flex-1">
                        <div className="flex items-center gap-2">
                            {category.hasChildren ? (
                                <Folder className="w-4 h-4 text-blue-600" />
                            ) : (
                                <FileText className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild onClick={(e) => handleOpenModalEditing(e, category)}>
                                    <Pencil size="16" color="#155dfc" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild onClick={(e) => handleAddCategory(e, category.id)}>
                                    <PlusCircle size="16" color="#155dfc" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add subcategory</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild onClick={(e) => handleOpenModalDelete(e, category)}>
                                    <Trash2Icon size="16" color="red" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Remove</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </AccordionTrigger>
                {category.hasChildren && (
                    <AccordionContent>
                        <div
                            key={category.id}
                            className={`flex items-center mt-1`}
                            style={{
                                paddingLeft: `${(level + 1) * 20}px`,
                            }}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary bg-gray-100  h-6 text-sm"
                                onClick={(e) => handleAddCategory(e, category.id)}
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Add subcategory
                            </Button>
                        </div>
                        {category.children?.length ? (
                            category.children?.map((child) => <Item key={child.id} category={child} level={level + 1} />)
                        ) : isLoading ? (
                            <div className={`text-sm text-center m-auto`} style={indentStyle}>
                                <Loader className="m-auto animate-spin" />
                            </div>
                        ) : (
                            <div className={`text-sm text-center m-auto`} style={indentStyle}>
                                No available categories.
                            </div>
                        )}
                    </AccordionContent>
                )}
            </AccordionItem>
        );
    };

    return (
        <>
            <SiteHeader title="Categories" />
            <div className="container mx-auto mt-6">
                <div className="flex flex-row justify-between items-center">
                    <Button size="sm" onClick={handleAddCategory} className="mb-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add category
                    </Button>
                </div>
                <div className="mt-4">
                    <Accordion type="multiple">
                        {categories?.map((category) => (
                            <Item key={category.id} category={category} />
                        ))}
                    </Accordion>
                </div>
            </div>
            <EditCategoryModal
                open={openModalEdit}
                errors={errors}
                selectedCategory={editingCategory}
                onSave={handleSaveCategory}
                onClose={handleCloseModalEdit}
            />
            <DeleteWarningModal
                open={openModalDelete}
                selectedCategory={editingCategory}
                onClose={handleCloseModalDelete}
                onDelete={handleRemoveCategory}
            />
        </>
    );
}
