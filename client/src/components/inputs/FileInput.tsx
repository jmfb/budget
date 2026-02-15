import { Button, CircularProgress } from "@mui/material";

export interface IFileInputProps {
	accept: string;
	children?: React.ReactNode;
	isDisabled?: boolean;
	isProcessing?: boolean;
	onClick(file: File): void;
}

export function FileInput({
	accept,
	children,
	isDisabled,
	isProcessing,
	onClick,
}: IFileInputProps) {
	const handleInputChanged = (event: React.FormEvent<HTMLInputElement>) => {
		const { files } = event.currentTarget;
		if (files && files.length > 0) {
			onClick(files[0]);
		}
		// Reset so the same file can be selected again
		event.currentTarget.value = "";
	};

	return (
		<Button
			variant="outlined"
			component="label"
			disabled={isDisabled || isProcessing}
			startIcon={
				isProcessing ? <CircularProgress size={20} /> : undefined
			}
		>
			{children}
			<input
				accept={accept}
				type="file"
				hidden
				onChange={handleInputChanged}
			/>
		</Button>
	);
}
