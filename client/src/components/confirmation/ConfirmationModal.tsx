import { ReactNode } from "react";
import {
	Grid,
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	Alert,
} from "@mui/material";
import { Close, Check, SvgIconComponent } from "@mui/icons-material";

export interface ConfirmationModalProps {
	header: ReactNode;
	message: ReactNode;
	variant?: "primary" | "error";
	isLoading?: boolean;
	hasError?: boolean;
	cancelIcon?: SvgIconComponent;
	cancelText?: string;
	confirmIcon?: SvgIconComponent;
	confirmText?: string;
	onCancel(): void;
	onConfirm(): void;
}

export function ConfirmationModal({
	header,
	message,
	variant,
	isLoading,
	hasError,
	cancelIcon: CancelIcon,
	cancelText,
	confirmIcon: ConfirmIcon,
	confirmText,
	onCancel,
	onConfirm,
}: ConfirmationModalProps) {
	const handleCancelClicked = () => {
		if (!isLoading) {
			onCancel();
		}
	};

	return (
		<Dialog open onClose={handleCancelClicked}>
			<DialogTitle>{header}</DialogTitle>
			<DialogContent>
				<Grid container direction="column" spacing={2}>
					{hasError && (
						<Alert variant="standard" color="error">
							There was an error. Please try again later.
						</Alert>
					)}
					<span>{message}</span>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					color="primary"
					startIcon={CancelIcon ? <CancelIcon /> : <Close />}
					disabled={isLoading}
					onClick={handleCancelClicked}
				>
					{cancelText ?? "Cancel"}
				</Button>
				<Button
					variant="contained"
					color={variant ?? "primary"}
					startIcon={ConfirmIcon ? <ConfirmIcon /> : <Check />}
					disabled={isLoading}
					loading={isLoading}
					onClick={onConfirm}
				>
					{confirmText ?? "OK"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
