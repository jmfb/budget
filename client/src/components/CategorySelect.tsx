import React from 'react';
import Creatable from 'react-select/creatable';
import styles from './CategorySelect.css';

export interface ICategorySelectProps {
	category: string;
	autoFocus?: boolean;
	onChange(category: string): void;
}

export default function CategorySelect({
	category,
	autoFocus,
	onChange
}: ICategorySelectProps) {
	const options = [
		// Well-Known Recurring Expenses
		'Car',
		'Holidays',
		'Home',
		'Internet',
		'Karate',
		// Well-Known Incomes
		'Direct Supply',
		// Common Expense Categories
		'Merchandise',
		'Dining',
		'Groceries',
		'Liquor',
		'Entertainment',
		'Pets',
		'Taxes',
		'Cash'
	]
		.sort((a, b) => a.localeCompare(b))
		.map(categoryName => ({ value: categoryName, label: categoryName }));
	let selectedOption = options.find(option => option.value === category);
	if (!selectedOption && category) {
		selectedOption = { value: category, label: category };
		options.push(selectedOption);
	}

	const handleChange = (option: { value: string }) => {
		onChange(option?.value ?? '');
	};

	return (
		<label className={styles.label}>
			Category
			<Creatable
				isClearable
				placeholder='Select category...'
				{...{ options, autoFocus }}
				value={selectedOption}
				onChange={handleChange}
			/>
		</label>
	);
}
