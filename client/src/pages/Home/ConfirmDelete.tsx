import { Modal, Button } from "~/components";

export interface IConfirmDeleteProps {
	onConfirmDelete(): void;
	onCancel(): void;
}

export function ConfirmDelete({
	onConfirmDelete,
	onCancel,
}: IConfirmDeleteProps) {
	return (
		<Modal
			onClose={onCancel}
			title="Confirm Delete"
			buttons={
				<>
					<Button variant="default" onClick={onCancel}>
						Cancel
					</Button>
					<Button variant="danger" onClick={onConfirmDelete}>
						Delete
					</Button>
				</>
			}
		>
			<div>Are you sure you want to delete this transaction?</div>
			<div>This action cannot be undone.</div>
		</Modal>
	);
}
