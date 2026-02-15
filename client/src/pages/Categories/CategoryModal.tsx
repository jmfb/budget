import { ChangeEvent, useState } from "react";
import { CategorySelect } from "~/components";
import {
	Grid,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Alert,
	TextField,
} from "@mui/material";
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
	const handleNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.currentTarget.value);
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
		<Dialog open onClose={handleCancel}>
			<DialogTitle>
				{existingCategory ? "Edit Category" : "New Category"}
			</DialogTitle>
			<DialogContent>
				<Grid container direction="column" spacing={2}>
					{deleteFailed && (
						<Alert color="error">
							Delete failed. Category must be in use.
						</Alert>
					)}
					<TextField
						variant="standard"
						label="Name"
						value={name}
						disabled={isFetching}
						onChange={handleNameChanged}
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
						<Box>
							<Button
								variant="outlined"
								color="secondary"
								disabled={isFetching}
								onClick={handleCancelRetire}
							>
								Cancel Retirement
							</Button>
						</Box>
					) : existingCategory ? (
						<Box>
							<Button
								variant="outlined"
								color="secondary"
								disabled={isFetching}
								onClick={handleRetire}
							>
								Retire
							</Button>
						</Box>
					) : null}
				</Grid>
			</DialogContent>
			<DialogActions>
				{existingCategory && (
					<Button
						variant="contained"
						color="error"
						style={{ marginRight: "auto" }}
						disabled={isFetching}
						loading={isDeleting}
						onClick={handleDelete}
					>
						Delete
					</Button>
				)}
				<Button
					variant="outlined"
					color="primary"
					disabled={isFetching}
					onClick={handleCancel}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="primary"
					disabled={isFetching || !isFormValid}
					loading={isSaving}
					onClick={handleSave}
				>
					{isAboutToRetire ? "Retire" : "Save"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
