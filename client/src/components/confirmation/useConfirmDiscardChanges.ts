import { Delete, Edit } from "@mui/icons-material";
import { useConfirmation } from "./useConfirmation";

export interface UseConfirmDiscardChangesProps {
	hasChanges: boolean;
	onConfirmed(): void;
}

export function useConfirmDiscardChanges({
	hasChanges,
	onConfirmed,
}: UseConfirmDiscardChangesProps) {
	const confirmation = useConfirmation({
		header: "Unsaved Changes",
		message: "You have unsaved changes. Discard and close anyway?",
		variant: "danger",
		cancelIcon: Edit,
		cancelText: "Keep editing",
		confirmIcon: Delete,
		confirmText: "Discard changes",
		onConfirmed,
	});

	return {
		children: confirmation.children,
		isConfirming: confirmation.isConfirming,
		showPrompt() {
			if (hasChanges) {
				confirmation.showPrompt();
			} else {
				onConfirmed();
			}
		},
	};
}
