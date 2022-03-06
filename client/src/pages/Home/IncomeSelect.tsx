import React from 'react';
import Select from 'react-select';
import { IIncome } from '~/models';
import styles from './IncomeSelect.css';

export interface IIncomeSelectProps {
	incomes: IIncome[];
	incomeName: string;
	onChange(incomeName: string): void;
}

export default function IncomeSelect({
	incomes,
	incomeName,
	onChange
}: IIncomeSelectProps) {
	const options = incomes.map(income => ({
		value: income,
		label: income.name
	}));
	const selectedOption = options.find(option => option.value.name === incomeName) ?? null;

	const handleChange = (option: { value: IIncome; }) => {
		onChange(option?.value.name ?? '');
	};

	return (
		<label className={styles.label}>
			Income
			<Select
				isClearable
				placeholder='Select income...'
				{...{options}}
				value={selectedOption}
				onChange={handleChange}
				/>
		</label>
	);
}
