"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";
import CategoryCascader from "../_components/category-cascader";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import ImageDropzone from "../_components/image-dropzone";
import { useDispatch } from "react-redux";
import { productActions } from "@/store/slices/product-slice";
import FormCard from "@/components/shared/FormCard";
import VariantBuilder from "../_components/VariantBuilder";
import DefaultPage from "@/components/shared/DefaultPage";
import CollectionsSelector from "../_components/collection-selector";
import { useCreateProduct, useGetProduct, useUpdateProduct } from "@/queries/products/useProducts";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { sortCategories } from "../_lib/category-utils";
import { Checkbox } from "@/components/ui/checkbox";
import useNavigation from "@/hooks/use-navigation";

export default function Page() {
    const router = useNavigation();
    const params = useParams();
    const dispatch = useDispatch();

    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const { data: dataProduct, isLoading: isLoadingProduct } = useGetProduct(params.productId);
    const product = useSelector((state) => state.product);

    const [category, setCategory] = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [errors, setErrors] = useState({});
    const oldProductValue = useRef(product);

    useEffect(() => {
        return () => {
            dispatch(productActions.discardProductToInitial());
            setErrors({});
        };
    }, [dispatch]);

    useEffect(() => {
        if (JSON.stringify(oldProductValue.current) != JSON.stringify(product)) {
            setHasUnsavedChanges(true);
        } else {
            setHasUnsavedChanges(false);
        }
    }, [product]);

    useEffect(() => {
        if (dataProduct && !isLoadingProduct) {
            dispatch(productActions.setProduct(dataProduct));
            setCategory(sortCategories(dataProduct.categories));
            oldProductValue.current = dataProduct;
        }
    }, [dataProduct, isLoadingProduct, dispatch]);

    useEffect(() => {
        if (category.length > 0) {
            let finalCategory = category.find((c) => !c.hasChildren);
            if (!finalCategory) {
                dispatch(productActions.setProductAttribute({ attribute: "category_id", value: category[category.length - 1].id }));
            }
        } else {
            dispatch(productActions.setProductAttribute({ attribute: "category_id", value: null }));
        }
    }, [category, dispatch]);

    const handleChangeProductAttribute = useCallback(
        (attribute, value) => {
            setErrors({});
            dispatch(productActions.setProductAttribute({ attribute, value }));
        },
        [dispatch],
    );

    const handleChangeImages = useCallback(
        (images) => {
            handleChangeProductAttribute("images", images);
        },
        [handleChangeProductAttribute],
    );

    const handleDiscard = useCallback(() => {
        if (params.productId && dataProduct) {
            dispatch(productActions.setProduct(dataProduct));
            setCategory(sortCategories(dataProduct.categories));
            oldProductValue.current = dataProduct;
        } else {
            dispatch(productActions.discardProductToInitial());
        }
        setHasUnsavedChanges(false);
    }, [dispatch, dataProduct, params.productId]);
    const handleCreateProduct = useCallback(async () => {
        try {
            await createProduct.mutateAsync(product);
            toast.success("Create product success");
            router.push("/products");
        } catch (error) {
            if (error.status == HttpStatusCode.UnprocessableEntity) {
                setErrors(error.data?.errors);
            }
            toast.error("Error create product");
        }
    }, [product, createProduct, router]);

    const handleUpdateProduct = useCallback(async () => {
        try {
            const result = await updateProduct.mutateAsync({ id: params.productId, data: product });
            dispatch(productActions.setProduct(result?.data));
            oldProductValue.current = result?.data;
            toast.success("Update product success");
            return;
        } catch (error) {
            if (error.status == HttpStatusCode.UnprocessableEntity) {
                setErrors(error.data?.errors);
            }
            toast.error("Error create product");
        }
    }, [dispatch, params.productId, product, updateProduct]);

    const handleSave = useCallback(async () => {
        try {
            if (params.productId && dataProduct) {
                await handleUpdateProduct();
            } else {
                await handleCreateProduct();
            }
        } catch (error) {
            if (error.status == HttpStatusCode.UnprocessableEntity) {
                setErrors(error.data?.errors);
            }
            toast.error("Error create product");
        }
    }, [dataProduct, params.productId, handleCreateProduct, handleUpdateProduct]);

    return (
        <DefaultPage hasUnsavedChanges={hasUnsavedChanges} onDiscard={handleDiscard} onSave={handleSave} isSaving={createProduct.isPending || updateProduct.isPending}>
            <div className="mx-auto max-w-4xl space-y-6 mt-4 mb-4 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{dataProduct ? "Edit product" : "Create product"}</h1>
                    {product?.is_active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Draft</Badge>}
                </div>
                <FormCard title={"Basic information"} description="Add the product title, description, media, and category.">
                    <div>
                        <Label>Title</Label>
                        <Input
                            value={product.name}
                            error={errors?.name}
                            maxLength={255}
                            onChange={(e) => handleChangeProductAttribute("name", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            rows="6"
                            className="resize-none"
                            value={product.description ?? ""}
                            onChange={(e) => handleChangeProductAttribute("description", e.target.value)}
                        />
                    </div>
                    <div className="flex items-center align-middle gap-2 w-full">
                        <Label>Active</Label>
                        <Checkbox
                            className="w-4 h-4"
                            checked={product.is_active}
                            onChange={(e) => handleChangeProductAttribute("is_active", e.target.checked)}
                        />
                    </div>
                    <div>
                        <Label>Media</Label>
                        <ImageDropzone currentImages={product.images} onSelectionChange={handleChangeImages} />
                    </div>
                    <div>
                        <Label>Categories</Label>
                        <CategoryCascader
                            selected={category}
                            onChange={(p) => setCategory(p)}
                            placeholder="Select category"
                            emptyText="No categories found"
                        />
                    </div>
                    <CollectionsSelector
                        selectedCollections={product.collection_ids}
                        handleChangeCollections={(collectionIds) => handleChangeProductAttribute("collection_ids", collectionIds)}
                    />
                </FormCard>
                <FormCard title="Variants" description="Add different sizes, colors, or other options.">
                    <VariantBuilder
                        initialOptions={product.options}
                        initialVariants={product.variants}
                        onChangeVariants={(variants) => handleChangeProductAttribute("variants", variants)}
                        onChangeOptions={(options) => handleChangeProductAttribute("options", options)}
                        errors={errors}
                    />
                </FormCard>
            </div>
        </DefaultPage>
    );
}
