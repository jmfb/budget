import { useMemo } from "react";
import { useAsyncState, useTriggerEffect } from "~/hooks";
import { useAppSelector, categoriesActions } from "~/redux";
import {
	Autocomplete,
	CircularProgress,
	TextField,
	createFilterOptions,
} from "@mui/material";

interface CategoryOption {
	value: string;
	label: string;
	inputValue?: string;
}

const filter = createFilterOptions<CategoryOption>();

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
	const options = useMemo<CategoryOption[]>(
		() =>
			categories.map((category) => ({
				value: category.id.toString(),
				label: category.name,
			})),
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
		_event: React.SyntheticEvent,
		option: CategoryOption | null,
	) => {
		if (option === null) {
			onChange(null);
		} else if (option.inputValue) {
			createCategory({ name: option.inputValue });
		} else {
			onChange(+option.value);
		}
	};

	return (
		<Autocomplete
			value={selectedOption}
			onChange={handleChange}
			filterOptions={(opts, params) => {
				const filtered = filter(opts, params);
				const { inputValue } = params;
				const isExisting = opts.some(
					(option) => inputValue === option.label,
				);
				if (inputValue !== "" && !isExisting) {
					filtered.push({
						value: "",
						label: `Add "${inputValue}"`,
						inputValue,
					});
				}
				return filtered;
			}}
			options={options}
			getOptionLabel={(option) => option.label}
			isOptionEqualToValue={(option, val) => option.value === val.value}
			disabled={isDisabled}
			loading={isCreating}
			clearOnBlur
			handleHomeEndKeys
			selectOnFocus
			renderInput={(params) => (
				<TextField
					{...params}
					label={name ?? "Category"}
					placeholder="Select category..."
					autoFocus={autoFocus}
					slotProps={{
						input: {
							...params.InputProps,
							endAdornment: (
								<>
									{isCreating ? (
										<CircularProgress size={20} />
									) : null}
									{params.InputProps.endAdornment}
								</>
							),
						},
					}}
				/>
			)}
		/>
	);
}
