import { lazy, useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { Header } from "./Header";
import {
	useActions,
	expensesSlice,
	incomesSlice,
	pendingItemsSlice,
	transactionsSlice,
} from "~/redux";
import { dateService } from "~/services";
import { clsx } from "clsx";
import styles from "./AuthorizedApplicationContainer.module.css";

const AsyncHomeContainer = lazy(() => import("~/containers/HomeContainer"));
const AsyncStatisticsContainer = lazy(
	() => import("~/containers/StatisticsContainer"),
);
const AsyncIncomesContainer = lazy(
	() => import("~/containers/IncomesContainer"),
);
const AsyncExpensesContainer = lazy(
	() => import("~/containers/ExpensesContainer"),
);
const AsyncUploadsContainer = lazy(
	() => import("~/containers/UploadsContainer"),
);
const AsyncYearlyExpensesContainer = lazy(
	() => import("~/containers/YearlyExpensesContainer"),
);
const AsyncSignOutContainer = lazy(
	() => import("~/containers/SignOutContainer"),
);
const AsyncAboutContainer = lazy(() => import("~/containers/AboutContainer"));
const AsyncSearchContainer = lazy(() => import("~/containers/SearchContainer"));

export function AuthorizedApplicationContainer() {
	const { getExpenses } = useActions(expensesSlice);
	const { getIncomes } = useActions(incomesSlice);
	const { getPendingItems } = useActions(pendingItemsSlice);
	const { getCurrentWeek, getRestOfCurrentYear } =
		useActions(transactionsSlice);

	useEffect(() => {
		const year = dateService.getCurrentYear();
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
						<Route path="/" element={<AsyncHomeContainer />} />
						<Route
							path="/statistics"
							element={<AsyncStatisticsContainer />}
						/>
						<Route
							path="/incomes"
							element={<AsyncIncomesContainer />}
						/>
						<Route
							path="/expenses"
							element={<AsyncExpensesContainer />}
						/>
						<Route
							path="/uploads"
							element={<AsyncUploadsContainer />}
						/>
						<Route
							path="/yearly-expenses/:expenseId"
							element={<AsyncYearlyExpensesContainer />}
						/>
						<Route
							path="/sign-out"
							element={<AsyncSignOutContainer />}
						/>
						<Route
							path="/about"
							element={<AsyncAboutContainer />}
						/>
						<Route
							path="/search"
							element={<AsyncSearchContainer />}
						/>
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</section>
			</main>
		</>
	);
}
