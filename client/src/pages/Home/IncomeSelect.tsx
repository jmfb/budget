import { useMemo } from "react";
import Select from "react-select";
import { IIncome } from "~/models";
import { budgetService } from "~/services";
import styles from "./IncomeSelect.module.css";

export interface IIncomeSelectProps {
	incomes: IIncome[];
	incomeId: number | null;
	onChange(newValue: number | null): void;
}

export function IncomeSelect({
	incomes,
	incomeId,
	onChange,
}: IIncomeSelectProps) {
	const options = useMemo(
		() => [
			{ value: "", label: "Select income..." },
			...incomes.map((income) => ({
				value: income.id.toString(),
				label: `${income.name} - ${budgetService.format(income.amount)}`,
			})),
		],
		[incomes],
	);
	const selectedOption =
		options.find(
			(option) => option.value === (incomeId?.toString() ?? ""),
		) ?? null;

	const handleChange = (option: { value: string } | null) => {
		onChange(option === null ? null : +option.value);
	};

	return (
		<label className={styles.label}>
			Income
			<Select
				isClearable
				placeholder="Select income..."
				options={options}
				value={selectedOption}
				onChange={handleChange}
			/>
		</label>
	);
}
