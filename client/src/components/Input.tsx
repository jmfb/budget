import React from 'react';
import styles from './Input.css';

export interface IInputProps {
	name: string;
	value: string;
	type?: 'text' | 'number';
	onChange(value: string): void;
	onBlur?(): void;
}

export default function Input({
	name,
	value,
	type,
	onChange,
	onBlur
}: IInputProps) {
	const handleChanged = (event: React.FormEvent<HTMLInputElement>) => {
		onChange(event.currentTarget.value);
	};

	return (
		<label className={styles.label}>
			{name}
			<input
				{...{
					value,
					onBlur
				}}
				className={styles.input}
				type={type ?? 'text'}
				onChange={handleChanged}
			/>
		</label>
	);
}
