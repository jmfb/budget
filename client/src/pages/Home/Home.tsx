import { PageLoading } from "~/components";
import { WeekView } from "./WeekView";
import { BudgetView } from "./BudgetView";
import { Transactions } from "./Transactions";
import { IIncome, IExpense, ITransaction, IPendingItem } from "~/models";
import { dateService } from "~/services";
import { clsx } from "clsx";
import styles from "./Home.module.css";

export interface IHomeProps {
	onlyShowNewItems: boolean;
	incomes: IIncome[];
	expenses: IExpense[];
	pendingItems: IPendingItem[];
	isLoading: boolean;
	week: ITransaction[];
	expenseTransactions: Record<string, ITransaction[]>;
	weekOf: string;
	setWeekOf(value: string): void;
	setOnlyShowNewItems(value: boolean): void;
}

export function Home({
	onlyShowNewItems,
	incomes,
	expenses,
	pendingItems,
	isLoading,
	week,
	expenseTransactions,
	weekOf,
	setWeekOf,
	setOnlyShowNewItems,
}: IHomeProps) {
	const includePendingItems = weekOf > dateService.getStartOfLastWeek();

	return (
		<>
			<div className={clsx("responsive", styles.fixedTop)}>
				<WeekView weekOf={weekOf} setWeekOf={setWeekOf} />
				{isLoading ? (
					<PageLoading message="Loading transactions..." />
				) : (
					<BudgetView
						incomes={incomes}
						expenses={expenses}
						expenseTransactions={expenseTransactions}
						pendingItems={includePendingItems ? pendingItems : []}
						transactions={week}
					/>
				)}
			</div>
			{!isLoading && (
				<div className={styles.scrollingBottom}>
					<Transactions
						onlyShowNewItems={onlyShowNewItems}
						incomes={incomes}
						expenses={expenses}
						expenseTransactions={expenseTransactions}
						includePendingItems={includePendingItems}
						setOnlyShowNewItems={setOnlyShowNewItems}
						variant="home"
						transactions={week}
					/>
				</div>
			)}
		</>
	);
}
