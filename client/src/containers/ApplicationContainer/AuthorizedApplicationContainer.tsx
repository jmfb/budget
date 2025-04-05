import { lazy, useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { Header } from "./Header";
import { IIndexModel } from "~/models";
import {
	useActions,
	expensesSlice,
	incomesSlice,
	pendingItemsSlice,
	transactionsSlice,
} from "~/redux";
import { clsx } from "clsx";
import styles from "./AuthorizedApplicationContainer.module.css";

// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncHomeContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'HomeContainer' */ "~/containers/HomeContainer"
		),
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncStatisticsContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'StatisticsContainer' */ "~/containers/StatisticsContainer"
		),
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncIncomesContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'IncomesContainer' */ "~/containers/IncomesContainer"
		),
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncExpensesContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'ExpensesContainer' */ "~/containers/ExpensesContainer"
		),
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncUploadsContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'UploadsContainer' */ "~/containers/UploadsContainer"
		),
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncYearlyExpensesContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'YearlyExpensesContainer' */ "~/containers/YearlyExpensesContainer"
		),
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncSignOutContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'SignOutContainer' */ "~/containers/SignOutContainer"
		),
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncAboutContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'AboutContainer' */ "~/containers/AboutContainer"
		),
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncSearchContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'SearchContainer' */ "~/containers/SearchContainer"
		),
);

export interface IAuthorizedApplicationContainerProps {
	indexModel: IIndexModel;
}

export function AuthorizedApplicationContainer({
	indexModel,
}: IAuthorizedApplicationContainerProps) {
	const { refreshExpenses } = useActions(expensesSlice);
	const { refreshIncomes } = useActions(incomesSlice);
	const { refreshPendingItems } = useActions(pendingItemsSlice);
	const { refreshTransactions } = useActions(transactionsSlice);

	useEffect(() => {
		refreshExpenses(indexModel.expensesVersion);
		refreshIncomes(indexModel.incomesVersion);
		refreshPendingItems(indexModel.pendingItemsVersion);
		refreshTransactions(indexModel.weekVersions);
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
							path="/yearly-expenses/:expense"
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
