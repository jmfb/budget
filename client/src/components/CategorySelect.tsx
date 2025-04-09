import { useMemo } from "react";
import { useAppSelector } from "~/redux";
import Creatable from "react-select/creatable";
import styles from "./CategorySelect.module.css";

export interface ICategorySelectProps {
	categoryId: number | null;
	autoFocus?: boolean;
	onChange(newValue: number | null): void;
}

export function CategorySelect({
	categoryId,
	autoFocus,
	onChange,
}: ICategorySelectProps) {
	const categories = useAppSelector((state) => state.categories.categories);
	const options = useMemo(
		() => [
			{ value: "", label: "Select category..." },
			...categories.map((category) => ({
				value: category.id.toString(),
				label: category.name,
			})),
		],
		[categories],
	);

	const handleChange = (option: { value: string } | null) => {
		onChange(option === null ? null : +option.value);
	};

	return (
		<label className={styles.label}>
			Category
			<Creatable
				isClearable
				placeholder="Select category..."
				options={options}
				autoFocus={autoFocus}
				value={options.find(
					(option) => option.value === (categoryId?.toString() ?? ""),
				)}
				onChange={handleChange}
			/>
		</label>
	);
}
