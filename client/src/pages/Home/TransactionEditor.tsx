import React, { useState } from 'react';
import { Modal, Button, Input } from '~/components';
import CategorySelect from './CategorySelect';
import IncomeSelect from './IncomeSelect';
import ExpenseSelect from './ExpenseSelect';
import { ITransaction, IIncome, IExpense } from '~/models';
import { budgetService } from '~/services';
import styles from './TransactionEditor.css';

export interface ITransactionEditorProps {
	transaction: ITransaction;
	incomes: IIncome[];
	expenses: IExpense[];
	isSavingTransaction: boolean;
	onSave(updatedTransaction: ITransaction): void;
	onCancel(): void;
}

export default function TransactionEditor({
	transaction,
	incomes,
	expenses,
	isSavingTransaction,
	onSave,
	onCancel
}: ITransactionEditorProps) {
	const [category, setCategory] = useState(transaction.category ?? '');
	const [note, setNote] = useState(transaction.note ?? '');
	const [expenseName, setExpenseName] = useState(transaction.expenseName ?? '');
	const [incomeName, setIncomeName] = useState(transaction.incomeName ?? '');

	const handleSaveClicked = () => {
		onSave({
			...transaction,
			category,
			note,
			expenseName,
			incomeName
		});
	};

	const {
		amount,
		description,
		date
	} = transaction;

	return (
		<Modal onClose={onCancel}>
			<h3>{description}</h3>
			<div className={styles.inputs}>
				<div className={styles.amount}>{budgetService.format(amount)} on {date}</div>
				<CategorySelect
					{...{category}}
					onChange={setCategory}
					/>
				<Input name='Note' value={note} onChange={setNote} />
				{!expenseName &&
					<IncomeSelect
						{...{incomes, incomeName}}
						onChange={setIncomeName}
						/>
				}
				{!incomeName &&
					<ExpenseSelect
						{...{expenses, expenseName}}
						onChange={setExpenseName}
						/>
				}
			</div>
			<hr />
			<div className={styles.buttons}>
				<Button
					onClick={handleSaveClicked}
					isDisabled={isSavingTransaction}
					isProcessing={isSavingTransaction}
					className={styles.saveButton}>
					Save
				</Button>
				<Button onClick={onCancel} isDisabled={isSavingTransaction}>Cancel</Button>
			</div>
		</Modal>
	);
}
