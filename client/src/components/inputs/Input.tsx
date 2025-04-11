import styles from "./Input.module.css";

export interface IInputProps {
	name: string;
	value: string;
	type?: "text" | "number";
	placeholder?: string;
	autoFocus?: boolean;
	isDisabled?: boolean;
	onChange(value: string): void;
	onBlur?(): void;
}

export function Input({
	name,
	value,
	type,
	placeholder,
	autoFocus,
	isDisabled,
	onChange,
	onBlur,
}: IInputProps) {
	const handleChanged = (event: React.FormEvent<HTMLInputElement>) => {
		onChange(event.currentTarget.value);
	};

	return (
		<label className={styles.label}>
			{name}
			<input
				value={value}
				placeholder={placeholder}
				autoFocus={autoFocus}
				onBlur={onBlur}
				className={styles.input}
				type={type ?? "text"}
				disabled={isDisabled}
				onChange={handleChanged}
			/>
		</label>
	);
}
