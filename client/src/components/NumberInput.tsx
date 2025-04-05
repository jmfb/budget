import { useState } from "react";
import { Input } from "./Input";

export interface INumberInputProps {
	name: string;
	value: number;
	onChange(value: number): void;
}

function toString(value: number) {
	return value.toString();
}

function parse(value: string) {
	const result = Number.parseInt(value, 10);
	return Number.isNaN(result) ? 0 : result;
}

export function NumberInput({ name, value, onChange }: INumberInputProps) {
	const [textValue, setTextValue] = useState(toString(value));

	const handleTextChanged = (newTextValue: string) => {
		setTextValue(newTextValue);
		const newValue = parse(newTextValue);
		if (newValue !== value) {
			onChange(newValue);
		}
	};

	const handleBlurred = () => {
		setTextValue(toString(value));
	};

	return (
		<Input
			name={name}
			type="number"
			value={textValue}
			onChange={handleTextChanged}
			onBlur={handleBlurred}
		/>
	);
}
