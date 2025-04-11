import styles from "./Checkbox.module.css";

export interface ICheckboxProps {
	name: string;
	value: boolean;
	isDisabled?: boolean;
	onChange(value: boolean): void;
}

export function Checkbox({
	name,
	value,
	isDisabled,
	onChange,
}: ICheckboxProps) {
	const handleChanged = (event: React.FormEvent<HTMLInputElement>) => {
		onChange(event.currentTarget.checked);
	};

	return (
		<label className={styles.label}>
			<input
				className={styles.input}
				type="checkbox"
				checked={value}
				disabled={isDisabled}
				onChange={handleChanged}
			/>
			{name}
		</label>
	);
}
