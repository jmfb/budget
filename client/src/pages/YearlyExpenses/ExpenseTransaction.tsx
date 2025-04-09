import { ITransaction } from "~/models";
import { budgetService } from "~/services";
import styles from "./ExpenseTransaction.module.css";

export interface IExpenseTransactionProps {
	transaction: ITransaction;
}

export function ExpenseTransaction({ transaction }: IExpenseTransactionProps) {
	const { amount, note, description, date } = transaction;
	return (
		<div className={styles.root}>
			<div className={styles.row}>
				<div className={styles.date}>{date}</div>
				<div className={styles.amount}>
					{budgetService.format(amount)}
				</div>
				<div className={styles.note}>{note}</div>
			</div>
			<div className={styles.row}>
				<div className={styles.description}>{description}</div>
			</div>
		</div>
	);
}
