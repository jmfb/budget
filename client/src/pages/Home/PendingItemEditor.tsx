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
		<Modal
			onClose={onCancel}
			title={
				existingPendingItem
					? 'Edit Pending Transaction'
					: 'New Pending Transaction'
			}
			deleteButton={
				existingPendingItem && (
					<Button
						variant='danger'
						onClick={handleDeleteClicked}
						isDisabled={isModificationInProgress}
						isProcessing={isDeleting}>
						Delete
					</Button>
				)
			}
			buttons={
				<>
					<Button
						variant='default'
						onClick={onCancel}
						isDisabled={isModificationInProgress}>
						Cancel
					</Button>
					<Button
						variant='primary'
						onClick={handleSaveClicked}
						isDisabled={isModificationInProgress}
						isProcessing={isSavingPendingItem}>
						Save
					</Button>
				</>
			}>
			<div className={styles.inputs}>
				<Input
					name='Name'
					autoFocus
					value={name}
					onChange={setName}
				/>
				<CurrencyInput
					name='Amount'
					value={amount}
					onChange={setAmount}
				/>
			</div>
		</Modal>
	);
}
