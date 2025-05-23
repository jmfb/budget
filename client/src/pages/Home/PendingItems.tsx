import { useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdSearch } from "react-icons/md";
import { Button, HorizontalLayout, VerticalLayout } from "~/components";
import { PendingItem } from "./PendingItem";
import { PendingItemEditorContainer } from "./PendingItemEditorContainer";
import { IPendingItem } from "~/models";
import { budgetService } from "~/services";
import { useAppSelector } from "~/redux";
import styles from "./PendingItems.module.css";

export function PendingItems() {
	const pendingItems = useAppSelector(
		(state) => state.pendingItems.pendingItems,
	);
	const categoryById = useAppSelector(
		(state) => state.categories.categoryById,
	);
	const incomeById = useAppSelector((state) => state.incomes.incomeById);
	const expenseById = useAppSelector((state) => state.expenses.expenseById);

	const [isEditing, setIsEditing] = useState(false);
	const [existingPendingItem, setExistingPendingItem] =
		useState<IPendingItem | null>(null);

	const createEditClickedHandler = (pendingItem: IPendingItem) => () => {
		setIsEditing(true);
		setExistingPendingItem(pendingItem);
	};

	const handleAddPendingItem = () => {
		setIsEditing(true);
		setExistingPendingItem(null);
	};

	const handleCloseEditor = () => {
		setIsEditing(false);
		setExistingPendingItem(null);
	};

	const totalAmount = budgetService.getTotalPendingSpend(pendingItems);

	return (
		<VerticalLayout gap="small">
			<HorizontalLayout
				verticalAlign="center"
				horizontalAlign="justified"
			>
				<HorizontalLayout verticalAlign="center">
					<h3>Pending Transactions</h3>
					{pendingItems.length !== 0 && (
						<span>{budgetService.format(totalAmount)}</span>
					)}
				</HorizontalLayout>
				<HorizontalLayout verticalAlign="center">
					<Link to="/search">
						<MdSearch className={styles.search} />
					</Link>
					<Button variant="primary" onClick={handleAddPendingItem}>
						<MdAdd className={styles.addIcon} />
					</Button>
				</HorizontalLayout>
			</HorizontalLayout>
			{[...pendingItems]
				.sort((a, b) => a.amount - b.amount)
				.map((pendingItem) => (
					<PendingItem
						key={pendingItem.id}
						categoryById={categoryById}
						incomeById={incomeById}
						expenseById={expenseById}
						pendingItem={pendingItem}
						onEdit={createEditClickedHandler(pendingItem)}
					/>
				))}
			{pendingItems.length === 0 && (
				<div className={styles.none}>
					There are no pending transactions.
				</div>
			)}
			{isEditing && (
				<PendingItemEditorContainer
					existingPendingItem={existingPendingItem}
					onClose={handleCloseEditor}
				/>
			)}
		</VerticalLayout>
	);
}
