import { Incomes } from "./Incomes";
import { useAppSelector } from "~/redux";

export function IncomesContainer() {
	const incomes = useAppSelector((state) => state.incomes.incomes);

	return <Incomes incomes={incomes} />;
}
