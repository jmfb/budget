import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, CurrencyInput } from '~/components';
import { IPendingItem } from '~/models';
import styles from './PendingItemEditor.css';

export interface IPendingItemEditorProps {
	nextPendingItemId: number;
	existingPendingItem: IPendingItem;
	isSavingPendingItem: boolean;
	savingPendingItemSuccess: boolean;
	deletePendingItem(pendingItem: IPendingItem): void;
	clearPendingItemSave(): void;
	onSave(pendingItem: IPendingItem): void;
	onCancel(): void;
}

export default function PendingItemEditor({
	nextPendingItemId,
	existingPendingItem,
	isSavingPendingItem,
	savingPendingItemSuccess,
	deletePendingItem,
	clearPendingItemSave,
	onSave,
	onCancel
}: IPendingItemEditorProps) {
	const [name, setName] = useState(existingPendingItem?.name ?? '');
	const [amount, setAmount] = useState(existingPendingItem?.amount ?? 0);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleSaveClicked = () => {
		const id = existingPendingItem?.id ?? nextPendingItemId;
		onSave({ id, name, amount });
	};

	const handleDeleteClicked = () => {
		setIsDeleting(true);
		deletePendingItem(existingPendingItem);
	};

	useEffect(() => {
		if (isDeleting && !isSavingPendingItem) {
			setIsDeleting(false);
			if (savingPendingItemSuccess) {
				onCancel();
			}
			clearPendingItemSave();
		}
	}, [isDeleting, isSavingPendingItem, savingPendingItemSuccess]);

	const isModificationInProgress = isSavingPendingItem || isDeleting;

	return (
		<Modal onClose={onCancel}>
			<h3>{existingPendingItem ? 'Edit Pending Transaction' : 'New Pending Transaction'}</h3>
			<div className={styles.inputs}>
				<Input name='Name' value={name} onChange={setName} />
				<CurrencyInput name='Amount' value={amount} onChange={setAmount} />
			</div>
			<hr />
			<div className={styles.buttons}>
				{existingPendingItem &&
					<Button
						onClick={handleDeleteClicked}
						isDisabled={isModificationInProgress}
						isProcessing={isDeleting}
						className={styles.deleteButton}>
						Delete
					</Button>
				}
				<Button
					onClick={handleSaveClicked}
					isDisabled={isModificationInProgress}
					isProcessing={isSavingPendingItem}
					className={styles.saveButton}>
					Save
				</Button>
				<Button
					onClick={onCancel}
					isDisabled={isModificationInProgress}>
					Cancel
				</Button>
			</div>
		</Modal>
	);
}
