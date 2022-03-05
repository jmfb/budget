import React, { useState } from 'react';
import { Button } from '~/components';
import EditIncomes from './EditIncomes';
import { budgetService } from '~/services';
import { IIncome } from '~/models';
import styles from './IncomeView.css';

export interface IIncomeViewProps {
	incomes: IIncome[];
	isSavingIncome: boolean;
	savingIncomeSuccess: boolean;
	saveIncome(income: IIncome): void;
	deleteIncome(income: IIncome): void;
	clearIncomeSave(): void;
}

export default function IncomeView({
	incomes,
	isSavingIncome,
	savingIncomeSuccess,
	saveIncome,
	deleteIncome,
	clearIncomeSave
}: IIncomeViewProps) {
	const [editing, setEditing] = useState(false);

	const weeklyIncomes = budgetService.getWeeklyIncomes(incomes);

	const handleEditClicked = () => setEditing(true);
	const handleCancelClicked = () => setEditing(false);

	return (
		<div className={styles.root}>
			Income {budgetService.format(weeklyIncomes)}
			<Button className={styles.button} onClick={handleEditClicked}>Edit</Button>
			{editing &&
				<EditIncomes
					{...{
						incomes,
						isSavingIncome,
						savingIncomeSuccess,
						saveIncome,
						deleteIncome,
						clearIncomeSave
					}}
					onClose={handleCancelClicked}
					/>
			}
		</div>
	);
}
