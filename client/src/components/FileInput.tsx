import React from 'react';
import cx from 'classnames';
import styles from './FileInput.css';
import buttonStyles from './Button.css';

export interface IFileInputProps {
	accept: string;
	children?: React.ReactNode;
	onClick(file: File): void;
}

export default function FileInput({
	accept,
	children,
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
				onChange={handleInputChanged}
				/>
			<div className={cx(buttonStyles.button, buttonStyles.primary, styles.button)}>{children}</div>
		</label>
	);
}
