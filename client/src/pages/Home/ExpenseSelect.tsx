import React from 'react';
import Select from 'react-select';
import { IExpense } from '~/models';
import styles from './ExpenseSelect.css';

export interface IExpenseSelectProps {
	expenses: IExpense[];
	expenseName: string;
	onChange(expenseName: string): void;
}

export default function ExpenseSelect({
	expenses,
	expenseName,
	onChange
}: IExpenseSelectProps) {
	const options = expenses.map(expense => ({
		value: expense,
		label: expense.name
	}));
	const selectedOption = options.find(option => option.value.name === expenseName) ?? null;

	const handleChange = (option: { value: IExpense; }) => {
		onChange(option?.value.name ?? '');
	};

	return (
		<label className={styles.label}>
			Expense
			<Select
				isClearable
				placeholder='Select expense...'
				{...{options}}
				value={selectedOption}
				onChange={handleChange}
				/>
		</label>
	);
}
