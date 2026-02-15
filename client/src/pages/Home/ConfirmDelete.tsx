import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";

export interface IConfirmDeleteProps {
	onConfirmDelete(): void;
	onCancel(): void;
}

export function ConfirmDelete({
	onConfirmDelete,
	onCancel,
}: IConfirmDeleteProps) {
	return (
		<Dialog open onClose={onCancel}>
			<DialogTitle>Confirm Delete</DialogTitle>
			<DialogContent>
				<div>Are you sure you want to delete this transaction?</div>
				<div>This action cannot be undone.</div>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" color="primary" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={onConfirmDelete}
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
