import { useState } from "react";
import { Button, Input, Modal } from "~/components";
import { ICategory, IUpdateCategoryRequest } from "~/models";

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

	const isFormValid = !!name.trim();

	const handleCancel = () => {
		if (!isSaving) {
			onCancel();
		}
	};
	const handleSave = () => {
		onSave({ name });
	};

	return (
		<Modal
			title={existingCategory ? "Edit Category" : "New Category"}
			onClose={handleCancel}
			buttons={
				<>
					<Button
						variant="default"
						isDisabled={isSaving}
						onClick={handleCancel}
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						isDisabled={isSaving || !isFormValid}
						isProcessing={isSaving}
						onClick={handleSave}
					>
						Save
					</Button>
				</>
			}
		>
			<Input
				name="Name"
				value={name}
				isDisabled={isSaving}
				onChange={setName}
			/>
		</Modal>
	);
}
