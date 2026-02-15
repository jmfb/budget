import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { IIncome } from "~/models";
import { budgetService } from "~/services";

interface IncomeOption {
	value: string;
	label: string;
}

export interface IIncomeSelectProps {
	incomes: IIncome[];
	incomeId: number | null;
	onChange(newValue: number | null): void;
}

export function IncomeSelect({
	incomes,
	incomeId,
	onChange,
}: IIncomeSelectProps) {
	const options = useMemo<IncomeOption[]>(
		() =>
			incomes.map((income) => ({
				value: income.id.toString(),
				label: `${income.name} - ${budgetService.format(income.amount)}`,
			})),
		[incomes],
	);

	const selectedOption =
		options.find(
			(option) => option.value === (incomeId?.toString() ?? ""),
		) ?? null;

	const handleChange = (
		_event: React.SyntheticEvent,
		option: IncomeOption | null,
	) => {
		onChange(option === null ? null : +option.value);
	};

	return (
		<Autocomplete
			value={selectedOption}
			onChange={handleChange}
			options={options}
			getOptionLabel={(option) => option.label}
			isOptionEqualToValue={(option, val) => option.value === val.value}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Income"
					variant="standard"
					placeholder="Select income..."
				/>
			)}
		/>
	);
}
