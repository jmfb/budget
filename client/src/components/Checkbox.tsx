import React from 'react';
import styles from './Checkbox.css';

export interface ICheckboxProps {
	name: string;
	value: boolean;
	onChange(value: boolean): void;
}

export default function Checkbox({ name, value, onChange }: ICheckboxProps) {
	const handleChanged = (event: React.FormEvent<HTMLInputElement>) => {
		onChange(event.currentTarget.checked);
	};

	return (
		<label className={styles.label}>
			<input
				className={styles.input}
				type='checkbox'
				checked={value}
				onChange={handleChanged}
			/>
			{name}
		</label>
	);
}
