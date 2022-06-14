import React from 'react';
import { Modal, Button } from '~/components';
import styles from './ConfirmDelete.css';

export interface IConfirmDeleteProps {
	onConfirmDelete(): void;
	onCancel(): void;
}

export default function ConfirmDelete({
	onConfirmDelete,
	onCancel
}: IConfirmDeleteProps) {
	return (
		<Modal onClose={onCancel}>
			<h3>Confirm Delete</h3>
			<div>Are you sure you want to delete this transaction?</div>
			<div>This action cannot be undone.</div>
			<hr />
			<div className={styles.buttons}>
				<Button onClick={onConfirmDelete}>Delete</Button>
				<Button
					onClick={onCancel}
					className={styles.cancelButton}>
					Cancel
				</Button>
			</div>
		</Modal>
	);
}
