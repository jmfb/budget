import { type ChangeEvent } from "react";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

export interface ICurrencyInputProps {
	name: string;
	value: string;
	autoFocus?: boolean;
	isDisabled?: boolean;
	onChange(newValue: string): void;
}

export function CurrencyInput({
	name,
	value,
	autoFocus,
	isDisabled,
	onChange,
}: ICurrencyInputProps) {
	const handleChanged = (event: ChangeEvent<HTMLInputElement>) => {
		onChange(event.currentTarget.value);
	};

	return (
		<NumericFormat
			customInput={TextField}
			label={name}
			variant="standard"
			prefix="$"
			thousandSeparator
			valueIsNumericString
			autoFocus={autoFocus}
			disabled={isDisabled}
			value={value}
			onChange={handleChanged}
		/>
	);
}
