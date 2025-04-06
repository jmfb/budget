import { useMemo } from "react";
import Select from "react-select";
import { IExpense } from "~/models";
import { budgetService } from "~/services";
import styles from "./ExpenseSelect.module.css";

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
	const options = useMemo(
		() => [
			{ value: "", label: "Select expense..." },
			...expenses.map((expense) => ({
				value: expense.id.toString(),
				label: `${expense.name} - ${budgetService.format(expense.amount)}`,
			})),
		],
		[expenses],
	);
	const selectedOption =
		options.find(
			(option) => option.value === (expenseId?.toString() ?? ""),
		) ?? null;

	const handleChange = (option: { value: string } | null) => {
		onChange(option === null ? null : +option.value);
	};

	return (
		<label className={styles.label}>
			Expense
			<Select
				isClearable
				placeholder="Select expense..."
				options={options}
				value={selectedOption}
				onChange={handleChange}
			/>
		</label>
	);
}
