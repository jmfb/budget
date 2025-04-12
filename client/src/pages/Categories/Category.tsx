import { HorizontalLayout, Button } from "~/components";
import { useAsyncState } from "~/hooks";
import { categoriesActions } from "~/redux";
import { ICategory } from "~/models";

export interface CategoryProps {
	category: ICategory;
	onEdit(): void;
}

export function Category({ category, onEdit }: CategoryProps) {
	const { isLoading: isDeleting, invoke: deleteCategory } = useAsyncState(
		categoriesActions.deleteCategory,
	);

	const handleDelete = () => {
		deleteCategory(category.id);
	};

	return (
		<HorizontalLayout
			width="100%"
			verticalAlign="center"
			horizontalAlign="justified"
		>
			<span>{category.name}</span>
			<HorizontalLayout>
				<Button
					variant="default"
					isDisabled={isDeleting}
					onClick={onEdit}
				>
					Edit
				</Button>
				<Button
					variant="danger"
					isDisabled={isDeleting}
					isProcessing={isDeleting}
					onClick={handleDelete}
				>
					Delete
				</Button>
			</HorizontalLayout>
		</HorizontalLayout>
	);
}
