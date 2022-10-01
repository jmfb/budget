import React, { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import { Button } from '~/components';
import { PendingItem } from './PendingItem';
import { PendingItemEditor } from './PendingItemEditor';
import { IPendingItem } from '~/models';
import { budgetService } from '~/services';
import styles from './PendingItems.css';

export interface IPendingItemsProps {
	pendingItems: IPendingItem[];
	isSavingPendingItem: boolean;
	savingPendingItemSuccess: boolean;
	savePendingItem(pendingItem: IPendingItem): void;
	deletePendingItem(pendingItem: IPendingItem): void;
	clearPendingItemSave(): void;
}

export function PendingItems({
	pendingItems,
	isSavingPendingItem,
	savingPendingItemSuccess,
	savePendingItem,
	deletePendingItem,
	clearPendingItemSave
}: IPendingItemsProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [existingPendingItem, setExistingPendingItem] =
		useState<IPendingItem>(null);
	const nextPendingItemId =
		Math.max(0, ...pendingItems.map(item => item.id)) + 1;

	const createEditClickedHandler = (pendingItem: IPendingItem) => () => {
		setIsEditing(true);
		setExistingPendingItem(pendingItem);
	};

	const handleAddPendingItem = () => {
		setIsEditing(true);
		setExistingPendingItem(null);
	};

	const handleSaveClicked = (updatedPendingItem: IPendingItem) => {
		setIsSaving(true);
		savePendingItem(updatedPendingItem);
	};

	const handleCancelClicked = () => {
		setIsEditing(false);
		setExistingPendingItem(null);
	};

	useEffect(() => {
		if (isSaving && !isSavingPendingItem) {
			setIsSaving(false);
			if (savingPendingItemSuccess) {
				setIsEditing(false);
			}
			clearPendingItemSave();
		}
	}, [isSaving, isSavingPendingItem, savingPendingItemSuccess]);

	const totalAmount = budgetService.getTotalPendingSpend(pendingItems);

	return (
		<div>
			<div className={styles.header}>
				<h3>Pending Transactions</h3>
				{pendingItems.length !== 0 && (
					<span className={styles.amount}>
						{budgetService.format(totalAmount)}
					</span>
				)}
				<Button
					className={styles.addButton}
					variant='primary'
					onClick={handleAddPendingItem}>
					<MdAdd className={styles.addIcon} />
				</Button>
			</div>
			{[...pendingItems]
				.sort((a, b) => a.amount - b.amount)
				.map(pendingItem => (
					<PendingItem
						key={pendingItem.id}
						{...{ pendingItem }}
						onEdit={createEditClickedHandler(pendingItem)}
					/>
				))}
			{pendingItems.length === 0 && (
				<div className={styles.none}>
					There are no pending transactions.
				</div>
			)}
			{isEditing && (
				<PendingItemEditor
					{...{
						nextPendingItemId,
						existingPendingItem,
						isSavingPendingItem,
						savingPendingItemSuccess,
						deletePendingItem,
						clearPendingItemSave
					}}
					onSave={handleSaveClicked}
					onCancel={handleCancelClicked}
				/>
			)}
		</div>
	);
}
