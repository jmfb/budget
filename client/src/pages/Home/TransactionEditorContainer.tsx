import { useState, useEffect } from 'react';
import { TransactionEditor } from './TransactionEditor';
import { ITransaction } from '~/models';
import { useActions, useAppSelector, transactionsSlice } from '~/redux';

export interface ITransactionEditorContainerProps {
	transaction: ITransaction;
	onClose(): void;
}

export function TransactionEditorContainer({
	transaction,
	onClose
}: ITransactionEditorContainerProps) {
	const {
		saveTransaction,
		deleteTransaction,
		clearSave: clearTransactionSave
	} = useActions(transactionsSlice);

	const incomes = useAppSelector(state => state.incomes.incomes);
	const expenses = useAppSelector(state => state.expenses.expenses);
	const isSavingTransaction = useAppSelector(
		state => state.transactions.isSaving
	);
	const savingTransactionSuccess = useAppSelector(
		state => state.transactions.wasSuccessful
	);

	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!isSavingTransaction && isSaving) {
			setIsSaving(false);
			if (savingTransactionSuccess) {
				onClose();
			}
		}
	}, [isSaving, isSavingTransaction, savingTransactionSuccess]);

	const handleSaveClicked = (updatedTransaction: ITransaction) => {
		setIsSaving(true);
		saveTransaction(updatedTransaction);
	};

	return (
		<TransactionEditor
			transaction={transaction}
			incomes={incomes}
			expenses={expenses}
			isSavingTransaction={isSavingTransaction}
			savingTransactionSuccess={savingTransactionSuccess}
			deleteTransaction={deleteTransaction}
			clearTransactionSave={clearTransactionSave}
			onSave={handleSaveClicked}
			onCancel={onClose}
		/>
	);
}
