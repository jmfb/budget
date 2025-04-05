import styles from "./Checkbox.module.css";

export interface ICheckboxProps {
	name: string;
	value: boolean;
	onChange(value: boolean): void;
}

export function Checkbox({ name, value, onChange }: ICheckboxProps) {
	const handleChanged = (event: React.FormEvent<HTMLInputElement>) => {
		onChange(event.currentTarget.checked);
	};

	return (
		<label className={styles.label}>
			<input
				className={styles.input}
				type="checkbox"
				checked={value}
				onChange={handleChanged}
			/>
			{name}
		</label>
	);
}
