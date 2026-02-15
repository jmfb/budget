import { Chip } from "@mui/material";
import { ICategory, IExpense, IIncome, IPendingItem } from "~/models";
import { budgetService } from "~/services";
import styles from "./PendingItem.module.css";

export interface IPendingItemProps {
	pendingItem: IPendingItem;
	categoryById: Record<number, ICategory>;
	incomeById: Record<number, IIncome>;
	expenseById: Record<number, IExpense>;
	onEdit(): void;
}

export function PendingItem({
	pendingItem,
	categoryById,
	incomeById,
	expenseById,
	onEdit,
}: IPendingItemProps) {
	const { name, amount, categoryId, incomeId, expenseId } = pendingItem;
	return (
		<div className={styles.root} onClick={onEdit}>
			<div className={styles.row}>
				<span>{budgetService.format(amount)}</span>
				<span className={styles.name}>{name}</span>
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
					<Chip className={styles.pill} variant="filled" size="small" color="success" label={incomeById[incomeId]?.name ?? `Invalid #${incomeId}`} />
				)}
				{expenseId !== null && (
					<Chip className={styles.pill} variant="filled" size="small" color="error" label={expenseById[expenseId]?.name ?? `Invalid #${expenseId}`} />
				)}
			</div>
		</div>
	);
}
