import { useMemo } from "react";
import { useAsyncState, useTriggerEffect } from "~/hooks";
import { useAppSelector, categoriesActions } from "~/redux";
import Creatable from "react-select/creatable";
import styles from "./CategorySelect.module.css";

export interface ICategorySelectProps {
	name?: string;
	categoryId: number | null;
	autoFocus?: boolean;
	isDisabled?: boolean;
	onChange(newValue: number | null): void;
}

export function CategorySelect({
	name,
	categoryId,
	autoFocus,
	isDisabled,
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

	const {
		isLoading: isCreating,
		wasSuccessful: createSuccessful,
		clear: clearCreate,
		invoke: createCategory,
		data: createResult,
	} = useAsyncState(categoriesActions.createCategory);

	useTriggerEffect(() => {
		if (createResult) {
			onChange(createResult.id);
		}
		clearCreate();
	}, createSuccessful);

	const selectedOption =
		options.find(
			(option) => option.value === (categoryId?.toString() ?? ""),
		) ?? null;

	const handleChange = (
		option: { value: string; __isNew__?: boolean } | null,
	) => {
		if (option === null) {
			onChange(null);
		} else if (option.__isNew__) {
			createCategory({ name: option.value });
		} else {
			onChange(+option.value);
		}
	};

	return (
		<label className={styles.label}>
			{name ?? "Category"}
			<Creatable
				isClearable={categoryId !== null}
				placeholder="Select category..."
				options={options}
				autoFocus={autoFocus}
				isDisabled={isDisabled}
				isLoading={isCreating}
				value={selectedOption}
				onChange={handleChange}
			/>
		</label>
	);
}
