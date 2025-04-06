import { Incomes } from "~/pages";
import { useAppSelector } from "~/redux";

export default function IncomesContainer() {
	const incomes = useAppSelector((state) => state.incomes.incomes);

	return <Incomes incomes={incomes} />;
}
