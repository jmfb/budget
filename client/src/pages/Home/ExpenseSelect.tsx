import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { IExpense } from "~/models";
import { budgetService } from "~/services";

interface ExpenseOption {
	value: string;
	label: string;
}

export interface IExpenseSelectProps {
	expenses: IExpense[];
	expenseId: number | null;
	onChange(newValue: number | null): void;
}

export function ExpenseSelect({
	expenses,
	expenseId,
	onChange,
}: IExpenseSelectProps) {
	const options = useMemo<ExpenseOption[]>(
		() =>
			expenses.map((expense) => ({
				value: expense.id.toString(),
				label: `${expense.name} - ${budgetService.format(expense.amount)}`,
			})),
		[expenses],
	);

	const selectedOption =
		options.find(
			(option) => option.value === (expenseId?.toString() ?? ""),
		) ?? null;

	const handleChange = (
		_event: React.SyntheticEvent,
		option: ExpenseOption | null,
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
					label="Expense"
					variant="standard"
					placeholder="Select expense..."
				/>
			)}
		/>
	);
}
