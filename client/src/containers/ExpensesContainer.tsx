import { Expenses } from "~/pages";
import { useAppSelector } from "~/redux";

export default function ExpensesContainer() {
	const expenses = useAppSelector((state) => state.expenses.expenses);
	const categoryById = useAppSelector(
		(state) => state.categories.categoryById,
	);

	return <Expenses expenses={expenses} categoryById={categoryById} />;
}
