import { useEffect } from "react";
import { useAsyncState } from "~/hooks";
import { PendingItemEditor } from "./PendingItemEditor";
import { IPendingItem, IUpdatePendingItemRequest } from "~/models";
import { useAppSelector, pendingItemsActions } from "~/redux";

export interface IPendingItemEditorContainerProps {
	existingPendingItem: IPendingItem | null;
	onClose(): void;
}

export function PendingItemEditorContainer({
	existingPendingItem,
	onClose,
}: IPendingItemEditorContainerProps) {
	const incomes = useAppSelector((state) => state.incomes.incomes);
	const expenses = useAppSelector((state) => state.expenses.expenses);

	const {
		isLoading: isCreating,
		wasSuccessful: createSuccessful,
		clear: clearCreate,
		invoke: createPendingItem,
	} = useAsyncState(pendingItemsActions.createPendingItem);
	const {
		isLoading: isUpdating,
		wasSuccessful: updateSuccessful,
		clear: clearUpdate,
		invoke: updatePendingItem,
	} = useAsyncState(pendingItemsActions.updatePendingItem);
	const {
		isLoading: isDeleting,
		wasSuccessful: deleteSuccessful,
		clear: clearDelete,
		invoke: deletePendingItem,
	} = useAsyncState(pendingItemsActions.deletePendingItem);

	useEffect(() => {
		if (createSuccessful || updateSuccessful || deleteSuccessful) {
			onClose();
		}
	}, [createSuccessful, updateSuccessful, deleteSuccessful]);

	const clearSave = () => {
		clearCreate();
		clearUpdate();
		clearDelete();
	};

	const handleSaveClicked = (request: IUpdatePendingItemRequest) => {
		clearSave();
		if (existingPendingItem) {
			updatePendingItem({
				pendingItemId: existingPendingItem.id,
				request,
			});
		} else {
			createPendingItem({ ...request });
		}
	};
	const handleDeleteClicked = () => {
		deletePendingItem(existingPendingItem!.id);
	};

	return (
		<PendingItemEditor
			incomes={incomes}
			expenses={expenses}
			existingPendingItem={existingPendingItem}
			isSaving={isCreating || isUpdating}
			isDeleting={isDeleting}
			onSave={handleSaveClicked}
			onDelete={handleDeleteClicked}
			onCancel={onClose}
		/>
	);
}
