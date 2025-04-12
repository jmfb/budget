import { useState } from "react";
import {
	Button,
	CategorySelect,
	HorizontalLayout,
	Input,
	Modal,
	VerticalLayout,
} from "~/components";
import { useAsyncState, useTriggerEffect } from "~/hooks";
import { ICategory, IUpdateCategoryRequest } from "~/models";
import { categoriesActions } from "~/redux";

export interface CategoryModalProps {
	existingCategory: ICategory | null;
	isSaving: boolean;
	onSave(request: IUpdateCategoryRequest): void;
	onCancel(): void;
}

export function CategoryModal({
	existingCategory,
	isSaving,
	onSave,
	onCancel,
}: CategoryModalProps) {
	const [name, setName] = useState(existingCategory?.name ?? "");
	const [isAboutToRetire, setIsAboutToRetire] = useState(false);
	const [replacementId, setReplacementId] = useState<number | null>(null);

	const {
		isLoading: isDeleting,
		wasSuccessful: deleteSuccessful,
		hasError: deleteFailed,
		invoke: deleteCategory,
	} = useAsyncState(categoriesActions.deleteCategory);
	const {
		isLoading: isRetiring,
		wasSuccessful: retireSuccessful,
		invoke: retireCategory,
	} = useAsyncState(categoriesActions.retireCategory);

	const isFetching = isSaving || isDeleting || isRetiring;

	useTriggerEffect(onCancel, deleteSuccessful || retireSuccessful);

	const isNameValid = !!name.trim();
	const isRetirementValid =
		replacementId !== null && replacementId !== existingCategory?.id;
	const isFormValid = isAboutToRetire ? isRetirementValid : isNameValid;

	const handleCancel = () => {
		if (!isSaving) {
			onCancel();
		}
	};
	const handleSave = () => {
		if (isAboutToRetire) {
			retireCategory({
				retireId: existingCategory!.id,
				replacementId: replacementId!,
			});
		} else {
			onSave({ name });
		}
	};
	const handleDelete = () => {
		deleteCategory(existingCategory!.id);
	};
	const handleRetire = () => {
		setIsAboutToRetire(true);
		setReplacementId(null);
	};
	const handleCancelRetire = () => {
		setIsAboutToRetire(false);
		setReplacementId(null);
	};

	return (
		<Modal
			title={existingCategory ? "Edit Category" : "New Category"}
			onClose={handleCancel}
			deleteButton={
				existingCategory && (
					<Button
						variant="danger"
						isDisabled={isFetching}
						isProcessing={isDeleting}
						onClick={handleDelete}
					>
						Delete
					</Button>
				)
			}
			buttons={
				<>
					<Button
						variant="default"
						isDisabled={isFetching}
						onClick={handleCancel}
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						isDisabled={isFetching || !isFormValid}
						isProcessing={isSaving}
						onClick={handleSave}
					>
						{isAboutToRetire ? "Retire" : "Save"}
					</Button>
				</>
			}
		>
			<VerticalLayout>
				{deleteFailed && (
					<span>Delete failed. Category must be in use.</span>
				)}
				<Input
					name="Name"
					value={name}
					isDisabled={isFetching}
					onChange={setName}
				/>
				{isAboutToRetire && (
					<CategorySelect
						name="Replacement Category"
						categoryId={replacementId}
						isDisabled={isFetching}
						onChange={setReplacementId}
					/>
				)}
				{isAboutToRetire ? (
					<HorizontalLayout>
						<Button
							variant="default"
							isDisabled={isFetching}
							onClick={handleCancelRetire}
						>
							Cancel Retirement
						</Button>
					</HorizontalLayout>
				) : existingCategory ? (
					<HorizontalLayout>
						<Button
							variant="default"
							isDisabled={isFetching}
							onClick={handleRetire}
						>
							Retire
						</Button>
					</HorizontalLayout>
				) : null}
			</VerticalLayout>
		</Modal>
	);
}
