import React from 'react';
import LoadingIcon from './LoadingIcon';
import cx from 'classnames';
import styles from './FileInput.css';
import buttonStyles from './Button.css';

export interface IFileInputProps {
	accept: string;
	children?: React.ReactNode;
	isDisabled?: boolean;
	isProcessing?: boolean;
	onClick(file: File): void;
}

export default function FileInput({
	accept,
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
				{...{accept}}
				className={styles.input}
				type='file'
				disabled={isDisabled}
				onChange={handleInputChanged}
				/>
			<div
				className={cx(
					buttonStyles.button,
					buttonStyles.primary,
					styles.button,
					{ [buttonStyles.processing]: isProcessing }
				)}>
				{children}
				{isProcessing &&
					<LoadingIcon />
				}
			</div>
		</label>
	);
}
