import { useState, useEffect } from "react";
import { PendingItemEditor } from "./PendingItemEditor";
import { IPendingItem } from "~/models";
import { useActions, useAppSelector, pendingItemsSlice } from "~/redux";

export interface IPendingItemEditorContainerProps {
	existingPendingItem: IPendingItem;
	onClose(): void;
}

export function PendingItemEditorContainer({
	existingPendingItem,
	onClose,
}: IPendingItemEditorContainerProps) {
	const {
		savePendingItem,
		deletePendingItem,
		clearSave: clearPendingItemSave,
	} = useActions(pendingItemsSlice);

	const incomes = useAppSelector((state) => state.incomes.incomes);
	const expenses = useAppSelector((state) => state.expenses.expenses);
	const pendingItems = useAppSelector(
		(state) => state.pendingItems.pendingItems,
	);
	const isSavingPendingItem = useAppSelector(
		(state) => state.pendingItems.isSaving,
	);
	const savingPendingItemSuccess = useAppSelector(
		(state) => state.pendingItems.wasSuccessful,
	);

	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (isSaving && !isSavingPendingItem) {
			setIsSaving(false);
			if (savingPendingItemSuccess) {
				onClose();
			}
			clearPendingItemSave();
		}
	}, [isSaving, isSavingPendingItem, savingPendingItemSuccess]);

	const handleSaveClicked = (updatedPendingItem: IPendingItem) => {
		setIsSaving(true);
		savePendingItem(updatedPendingItem);
	};

	const nextPendingItemId =
		Math.max(0, ...pendingItems.map((item) => item.id)) + 1;

	return (
		<PendingItemEditor
			incomes={incomes}
			expenses={expenses}
			nextPendingItemId={nextPendingItemId}
			existingPendingItem={existingPendingItem}
			isSavingPendingItem={isSavingPendingItem}
			savingPendingItemSuccess={savingPendingItemSuccess}
			deletePendingItem={deletePendingItem}
			clearPendingItemSave={clearPendingItemSave}
			onSave={handleSaveClicked}
			onCancel={onClose}
		/>
	);
}
