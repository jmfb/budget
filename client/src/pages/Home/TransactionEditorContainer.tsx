import { useEffect } from "react";
import { TransactionEditor } from "./TransactionEditor";
import { ITransaction, IUpdateTransactionRequest } from "~/models";
import { useAppSelector, transactionsActions } from "~/redux";
import { useAsyncState } from "~/hooks";

export interface ITransactionEditorContainerProps {
	transaction: ITransaction;
	onClose(): void;
}

export function TransactionEditorContainer({
	transaction,
	onClose,
}: ITransactionEditorContainerProps) {
	const incomes = useAppSelector((state) => state.incomes.incomes);
	const expenses = useAppSelector((state) => state.expenses.expenses);

	const {
		isLoading: isUpdating,
		wasSuccessful: updateSuccessful,
		clear: clearUpdate,
		invoke: updateTransaction,
	} = useAsyncState(transactionsActions.updateTransaction);
	const {
		isLoading: isDeleting,
		wasSuccessful: deleteSuccessful,
		clear: clearDelete,
		invoke: deleteTransaction,
	} = useAsyncState(transactionsActions.deleteTransaction);

	useEffect(() => {
		if (updateSuccessful || deleteSuccessful) {
			onClose();
		}
	}, [updateSuccessful, deleteSuccessful]);

	const clearSave = () => {
		clearUpdate();
		clearDelete();
	};

	const handleSaveClicked = (request: IUpdateTransactionRequest) => {
		clearSave();
		updateTransaction({ transactionId: transaction.id, request });
	};
	const handleDeleteClicked = () => {
		clearSave();
		deleteTransaction(transaction.id);
	};

	return (
		<TransactionEditor
			transaction={transaction}
			incomes={incomes}
			expenses={expenses}
			isSaving={isUpdating}
			isDeleting={isDeleting}
			onSave={handleSaveClicked}
			onDelete={handleDeleteClicked}
			onCancel={onClose}
		/>
	);
}
