import { Delete, Edit } from "@mui/icons-material";
import { useConfirmation } from "./useConfirmation";
import { useMediaQuery, useTheme } from "@mui/material";

export interface UseConfirmDiscardChangesProps {
	hasChanges: boolean;
	onConfirmed(): void;
}

export function useConfirmDiscardChanges({
	hasChanges,
	onConfirmed,
}: UseConfirmDiscardChangesProps) {
	const { breakpoints } = useTheme();
	const terse = useMediaQuery(breakpoints.down("md"));

	const confirmation = useConfirmation({
		header: "Unsaved Changes",
		message: "You have unsaved changes. Discard and close anyway?",
		variant: "error",
		cancelIcon: Edit,
		cancelText: "Keep editing",
		confirmIcon: Delete,
		confirmText: terse ? "Discard" : "Discard changes",
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
