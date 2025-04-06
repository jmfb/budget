import { useAsyncState } from "~/hooks";
import { Button } from "~/components";
import { IExpense } from "~/models";
import { budgetService } from "~/services";
import { expensesActions } from "~/redux";
import styles from "./Expense.module.css";

export interface IExpenseProps {
	expense: IExpense;
	onEdit(): void;
}

export function Expense({ expense, onEdit }: IExpenseProps) {
	const { name, amount, monthsInterval, isDistributed } = expense;
	const interval = isDistributed
		? monthsInterval === 1
			? "over a month"
			: `over ${monthsInterval} months`
		: monthsInterval === 1
			? "every month"
			: `every ${monthsInterval} months`;

	const { isLoading: isDeleting, invoke: deleteExpense } = useAsyncState(
		expensesActions.deleteExpense,
	);

	const handleDeleteClicked = () => {
		deleteExpense(expense.id);
	};

	return (
		<div className={styles.root}>
			<span className={styles.text}>
				{name} - {budgetService.format(amount)} {interval}
			</span>
			<Button
				variant="default"
				className={styles.editButton}
				onClick={onEdit}
			>
				Edit
			</Button>
			<Button
				variant="danger"
				onClick={handleDeleteClicked}
				isProcessing={isDeleting}
				isDisabled={isDeleting}
			>
				Delete
			</Button>
		</div>
	);
}
