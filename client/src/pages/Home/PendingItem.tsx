import { Pill } from "~/components";
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
				<span className={styles.amount}>
					{budgetService.format(amount)}
				</span>
				<span className={styles.name}>{name}</span>
				{incomeId === null &&
					expenseId === null &&
					categoryId === null && (
						<Pill className={styles.pill} type="new">
							New!
						</Pill>
					)}
				{incomeId === null &&
					expenseId === null &&
					categoryId !== null && (
						<Pill className={styles.pill} type="info">
							{categoryById[categoryId].name}
						</Pill>
					)}
				{incomeId !== null && (
					<Pill className={styles.pill} type="success">
						{incomeById[incomeId].name}
					</Pill>
				)}
				{expenseId !== null && (
					<Pill className={styles.pill} type="danger">
						{expenseById[expenseId].name}
					</Pill>
				)}
			</div>
		</div>
	);
}
