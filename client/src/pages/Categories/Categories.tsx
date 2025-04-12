import { useState } from "react";
import { Button, HorizontalLayout, VerticalLayout } from "~/components";
import { CategoryModal } from "./CategoryModal";
import { Category } from "./Category";
import { useAsyncState, useTriggerEffect } from "~/hooks";
import { categoriesActions, useAppSelector } from "~/redux";
import { ICategory, IUpdateCategoryRequest } from "~/models";

export function Categories() {
	const [isEditing, setIsEditing] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
		null,
	);

	const categories = useAppSelector((state) => state.categories.categories);

	const {
		isLoading: isCreating,
		wasSuccessful: createSuccessful,
		clear: clearCreate,
		invoke: createCategory,
	} = useAsyncState(categoriesActions.createCategory);
	const {
		isLoading: isUpdating,
		wasSuccessful: updateSuccessful,
		clear: clearUpdate,
		invoke: updateCategory,
	} = useAsyncState(categoriesActions.updateCategory);

	const isSaving = isCreating || isUpdating;
	const wasSuccessful = createSuccessful || updateSuccessful;
	const clearSave = () => {
		clearCreate();
		clearUpdate();
	};

	const closeModal = () => {
		setIsEditing(false);
		setSelectedCategory(null);
	};

	useTriggerEffect(() => {
		if (wasSuccessful) {
			clearSave();
			closeModal();
		}
	}, wasSuccessful);

	const handleAddClicked = () => {
		setIsEditing(true);
		setSelectedCategory(null);
	};
	const createEditHandler = (category: ICategory) => () => {
		setIsEditing(true);
		setSelectedCategory(category);
	};
	const handleEditSave = (request: IUpdateCategoryRequest) => {
		clearSave();
		if (selectedCategory) {
			updateCategory({ categoryId: selectedCategory.id, request });
		} else {
			createCategory({ ...request });
		}
		closeModal();
	};

	return (
		<VerticalLayout>
			<HorizontalLayout
				verticalAlign="center"
				horizontalAlign="justified"
				width="100%"
			>
				<h2>Categories</h2>
				<Button variant="primary" onClick={handleAddClicked}>
					Add
				</Button>
			</HorizontalLayout>
			{categories.map((category) => (
				<Category
					key={category.id}
					category={category}
					onEdit={createEditHandler(category)}
				/>
			))}
			{isEditing && (
				<CategoryModal
					existingCategory={selectedCategory}
					isSaving={isSaving}
					onSave={handleEditSave}
					onCancel={closeModal}
				/>
			)}
		</VerticalLayout>
	);
}
