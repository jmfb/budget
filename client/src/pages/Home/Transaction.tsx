import { Chip } from "@mui/material";
import { ITransaction, IIncome, IExpense, ICategory } from "~/models";
import { budgetService } from "~/services";
import styles from "./Transaction.module.css";

export interface ITransactionProps {
	transaction: ITransaction;
	categoryById: Record<number, ICategory>;
	incomeById: Record<number, IIncome>;
	expenseById: Record<number, IExpense>;
	expenseTransactions: Record<string, ITransaction[]>;
	onEdit(): void;
}

export function Transaction({
	transaction,
	categoryById,
	incomeById,
	expenseById,
	expenseTransactions,
	onEdit,
}: ITransactionProps) {
	const { amount, description, categoryId, note, expenseId, incomeId } =
		transaction;
	const discrepancy = budgetService.getDiscrepancy(
		transaction,
		incomeById,
		expenseById,
		expenseTransactions,
	);
	return (
		<div className={styles.root} onClick={onEdit}>
			<div className={styles.row}>
				<span>{budgetService.format(amount)}</span>
				{discrepancy < 0 && (
					<span className={styles.negativeDiscrepancy}>
						+{budgetService.format(-discrepancy)}
					</span>
				)}
				{discrepancy > 0 && (
					<span className={styles.positiveDiscrepancy}>
						-{budgetService.format(discrepancy)}
					</span>
				)}
				{note && <span className={styles.note}>{note}</span>}
				{incomeId === null &&
					expenseId === null &&
					categoryId === null && (
						<Chip className={styles.pill} variant="filled" size="small" color="primary" label="New!" />
					)}
				{incomeId === null &&
					expenseId === null &&
					categoryId !== null && (
						<Chip className={styles.pill} variant="filled" size="small" color="warning" label={categoryById[categoryId].name} />
					)}
				{incomeId !== null && (
					<Chip className={styles.pill} variant="filled" size="small" color="success" label={incomeById[incomeId].name} />
				)}
				{expenseId !== null && (
					<Chip className={styles.pill} variant="filled" size="small" color="error" label={expenseById[expenseId].name} />
				)}
			</div>
			<div className={styles.description}>{description}</div>
		</div>
	);
}
