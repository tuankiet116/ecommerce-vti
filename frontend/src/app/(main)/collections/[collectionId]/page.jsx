"use client";

import DefaultPage from "@/components/shared/DefaultPage";
import FormCard from "@/components/shared/FormCard";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useNavigation from "@/hooks/use-navigation";
import { useCreateCollection, useGetCollectionById, useUpdateCollection } from "@/queries/products/useCollections";
import { collectionActions } from "@/store/slices/collection-slice";
import { HttpStatusCode } from "axios";
import { isEqual } from "lodash";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Page() {
    const router = useNavigation();
    const params = useParams();
    const dispatch = useDispatch();

    const { data: dataCollection } = useGetCollectionById(params.collectionId);
    const createCollection = useCreateCollection();
    const updateCollection = useUpdateCollection(params.collectionId);

    const collection = useSelector((state) => state.collection);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [errors, setErrors] = useState({});
    const oldCollection = useRef();

    useEffect(() => {
        if (dataCollection) {
            dispatch(collectionActions.setCollection(dataCollection));
            oldCollection.current = dataCollection;
        } else {
            oldCollection.current = collection;
        }
    }, [dataCollection]);

    useEffect(() => {
        if (isEqual(oldCollection.current, collection)) {
            setHasUnsavedChanges(false);
        } else {
            setHasUnsavedChanges(true);
        }
    }, [oldCollection, collection]);

    const handleChangeCollection = useCallback(
        (attribute, value) => {
            setErrors({});
            dispatch(collectionActions.setCollectionAttribute({ attribute, value }));
        },
        [dispatch],
    );

    const handleCreateCollection = useCallback(async () => {
        try {
            let result = await createCollection.mutateAsync(collection);
            if (result) {
                router.push(`/collections`);
                toast.success("Create collection successfully");
            }
        } catch (error) {
            if (error?.status === HttpStatusCode.UnprocessableEntity) {
                setErrors(error.data?.errors || {});
            } else {
                console.log("Error create collection", error);
            }
        }
    }, [dispatch, collection]);

    const handleUpdateCollection = useCallback(async () => {
        try {
            let result = await updateCollection.mutateAsync(collection);
            if (result) {
                dispatch(collectionActions.setCollection(result));
                oldCollection.current = result;
                setHasUnsavedChanges(false);
                setErrors({});
                toast.success("Update collection successfully");
            }
        } catch (error) {
            if (error?.status === HttpStatusCode.UnprocessableEntity) {
                setErrors(error.data?.errors || {});
            } else {
                console.log("Error update collection", error);
            }
        }
    }, [dispatch, collection]);

    const discardChanges = useCallback(() => {
        if (dataCollection) {
            dispatch(collectionActions.setCollection(dataCollection));
        } else {
            dispatch(collectionActions.discardCollectionToInitial());
        }
        setHasUnsavedChanges(false);
        setErrors({});
    }, [dispatch, dataCollection]);

    const handleSave = useCallback(async () => {
        if (dataCollection) {
            await handleUpdateCollection();
        } else {
            await handleCreateCollection();
        }
    }, [collection, createCollection, router]);

    return (
        <DefaultPage hasUnsavedChanges={hasUnsavedChanges} onDiscard={discardChanges} onSave={handleSave} isSaving={createCollection.isPending || updateCollection.isPending}>
            <div className="mx-auto max-w-4xl w-full space-y-6 mt-4 mb-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{dataCollection ? "Edit collection" : "Create collection"}</h1>
                    {collection?.is_active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Draft</Badge>}
                </div>
                <FormCard title="Collection details" description={`Manage your collection details here.`}>
                    <div>
                        <Label>Collection name:</Label>
                        <Input
                            value={collection?.name ?? ""}
                            onChange={(e) => handleChangeCollection("name", e.target.value)}
                            error={errors?.slug || errors?.name}
                        />
                    </div>
                    <div>
                        <Label>Description:</Label>
                        <Textarea
                            value={collection?.description}
                            onChange={(e) => handleChangeCollection("description", e.target.value)}
                            rows={4}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label>Status</Label>
                        <Checkbox
                            checked={collection?.is_active}
                            onCheckedChange={(checked) => handleChangeCollection("is_active", checked)}
                        />
                    </div>
                </FormCard>
            </div>
        </DefaultPage>
    );
}
