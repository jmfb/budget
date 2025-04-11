import { useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { Header } from "./Header";
import {
	HomeContainer,
	StatisticsContainer,
	Configure,
	UploadsContainer,
	YearlyExpensesContainer,
	SignOutContainer,
	About,
	SearchContainer,
} from "~/pages";
import {
	useActions,
	expensesSlice,
	incomesSlice,
	pendingItemsSlice,
	transactionsSlice,
	categoriesSlice,
} from "~/redux";
import { dateService } from "~/services";
import { clsx } from "clsx";
import styles from "./AuthorizedApplicationContainer.module.css";

export function AuthorizedApplicationContainer() {
	const { getCategories } = useActions(categoriesSlice);
	const { getExpenses } = useActions(expensesSlice);
	const { getIncomes } = useActions(incomesSlice);
	const { getPendingItems } = useActions(pendingItemsSlice);
	const { getCurrentWeek, getRestOfCurrentYear } =
		useActions(transactionsSlice);

	useEffect(() => {
		const year = dateService.getCurrentYear();
		getCategories();
		getExpenses(year);
		getIncomes(year);
		getPendingItems();
		getCurrentWeek();
		getRestOfCurrentYear();
	}, []);

	return (
		<>
			<Header />
			<main className={clsx("responsive", styles.main)}>
				<section>
					<Routes>
						<Route path="/" element={<HomeContainer />} />
						<Route
							path="/statistics"
							element={<StatisticsContainer />}
						/>
						<Route path="/configure" element={<Configure />} />
						<Route path="/uploads" element={<UploadsContainer />} />
						<Route
							path="/yearly-expenses/:expenseId"
							element={<YearlyExpensesContainer />}
						/>
						<Route
							path="/sign-out"
							element={<SignOutContainer />}
						/>
						<Route path="/about" element={<About />} />
						<Route path="/search" element={<SearchContainer />} />
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</section>
			</main>
		</>
	);
}
