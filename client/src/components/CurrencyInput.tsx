import { useState } from 'react';
import { Input } from './Input';
import { budgetService } from '~/services';

export interface ICurrencyInputProps {
	name: string;
	value: number;
	autoFocus?: boolean;
	onChange(value: number): void;
}

function toString(value: number) {
	return budgetService.format(value).slice(1);
}

function parse(value: string) {
	const cleanValue = (value ?? '').replace(/\,/g, '');
	const result = Number.parseFloat(cleanValue);
	return Number.isNaN(result) ? 0 : result;
}

export function CurrencyInput({
	name,
	value,
	autoFocus,
	onChange
}: ICurrencyInputProps) {
	const [textValue, setTextValue] = useState(
		value === 0 ? '' : toString(value)
	);

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
			autoFocus={autoFocus}
			value={textValue}
			placeholder='0.00'
			onChange={handleTextChanged}
			onBlur={handleBlurred}
		/>
	);
}
