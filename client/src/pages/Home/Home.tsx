import { PageLoading } from "~/components";
import { WeekView } from "./WeekView";
import { BudgetView } from "./BudgetView";
import { Transactions } from "./Transactions";
import {
	IIncome,
	IExpense,
	ITransaction,
	IPendingItem,
	ICategory,
} from "~/models";
import { dateService } from "~/services";
import { clsx } from "clsx";
import styles from "./Home.module.css";

export interface IHomeProps {
	onlyShowNewItems: boolean;
	categoryById: Record<number, ICategory>;
	incomeById: Record<number, IIncome>;
	expenseById: Record<number, IExpense>;
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
	categoryById,
	incomeById,
	expenseById,
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
						incomeById={incomeById}
						expenseById={expenseById}
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
						categoryById={categoryById}
						incomeById={incomeById}
						expenseById={expenseById}
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
