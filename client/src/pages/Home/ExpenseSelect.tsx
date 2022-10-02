import React from 'react';
import Select from 'react-select';
import { IExpense } from '~/models';
import { budgetService } from '~/services';
import styles from './ExpenseSelect.module.css';

export interface IExpenseSelectProps {
	expenses: IExpense[];
	expenseName: string;
	onChange(expenseName: string): void;
}

export function ExpenseSelect({
	expenses,
	expenseName,
	onChange
}: IExpenseSelectProps) {
	const options = expenses.map(expense => ({
		value: expense,
		label: `${expense.name} - ${budgetService.format(expense.amount)}`
	}));
	const selectedOption =
		options.find(option => option.value.name === expenseName) ?? null;

	const handleChange = (option: { value: IExpense }) => {
		onChange(option?.value.name ?? '');
	};

	return (
		<label className={styles.label}>
			Expense
			<Select
				isClearable
				placeholder='Select expense...'
				{...{ options }}
				value={selectedOption}
				onChange={handleChange}
			/>
		</label>
	);
}
