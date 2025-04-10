import { useAsyncState } from "~/hooks";
import { Button } from "~/components";
import { IIncome } from "~/models";
import { budgetService } from "~/services";
import { incomesActions } from "~/redux";
import styles from "./Income.module.css";

export interface IIncomeProps {
	income: IIncome;
	onEdit(): void;
}

export function Income({ income, onEdit }: IIncomeProps) {
	const { name, amount, weeksInterval } = income;
	const interval =
		weeksInterval === 1
			? "every week"
			: weeksInterval === 52
				? "every year"
				: `every ${weeksInterval} weeks`;

	const { isLoading: isDeleting, invoke: deleteIncome } = useAsyncState(
		incomesActions.deleteIncome,
	);

	const handleDeleteClicked = () => {
		deleteIncome(income.id);
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
