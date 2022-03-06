import React, { useState } from 'react';
import Input from './Input';
import { budgetService } from '~/services';

export interface ICurrencyInputProps {
	name: string;
	value: number;
	onChange(value: number): void;
}

function toString(value: number) {
	return budgetService.format(value).slice(1);
}

function parse(value: string) {
	const result = Number.parseFloat(value);
	return Number.isNaN(result) ? 0 : result;
}

export default function CurrencyInput({
	name,
	value,
	onChange
}: ICurrencyInputProps) {
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
			{...{name}}
			value={textValue}
			onChange={handleTextChanged}
			onBlur={handleBlurred}
			/>
	);
}
