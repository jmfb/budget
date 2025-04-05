import { LoadingIcon } from './LoadingIcon';
import { ButtonVariant } from './Button';
import { clsx } from "clsx";
import styles from './FileInput.module.css';
import buttonStyles from './Button.module.css';

export interface IFileInputProps {
	accept: string;
	variant?: ButtonVariant;
	children?: React.ReactNode;
	isDisabled?: boolean;
	isProcessing?: boolean;
	onClick(file: File): void;
}

export function FileInput({
	accept,
	variant,
	children,
	isDisabled,
	isProcessing,
	onClick
}: IFileInputProps) {
	const handleInputChanged = (event: React.FormEvent<HTMLInputElement>) => {
		onClick(event.currentTarget.files[0]);
	};

	return (
		<label>
			<input
				accept={accept}
				className={styles.input}
				type='file'
				disabled={isDisabled}
				onChange={handleInputChanged}
			/>
			<div
				className={clsx(
					buttonStyles.button,
					buttonStyles[variant ?? 'default'],
					styles.button,
					isProcessing && buttonStyles.processing
				)}>
				{children}
				{isProcessing && <LoadingIcon />}
			</div>
		</label>
	);
}
