import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { CategorySelect } from "./CategorySelect";
import { makeStoreDecorator } from "~/decorators";
import { fn } from "@storybook/test";

const meta = {
	component: CategorySelect,
	render(props) {
		const [categoryId, setCategoryId] = useState(props.categoryId);
		return (
			<CategorySelect
				{...props}
				categoryId={categoryId}
				onChange={setCategoryId}
			/>
		);
	},
	args: {
		categoryId: null,
		onChange: fn(),
	},
	decorators: [
		makeStoreDecorator((state) => {
			state.categories.categories = [
				{ id: 1, name: "Food" },
				{ id: 2, name: "Tech" },
			];
		}),
	],
} satisfies Meta<typeof CategorySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const autoFocus: Story = { args: { autoFocus: true } };

export const disabled: Story = { args: { isDisabled: true } };

export const withSelection: Story = { args: { categoryId: 2 } };
