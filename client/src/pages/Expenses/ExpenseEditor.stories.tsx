import { Meta, StoryObj } from "@storybook/react";
import { ExpenseEditor } from "./ExpenseEditor";
import { fn } from "@storybook/test";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: ExpenseEditor,
	args: {
		existingExpense: null,
		isSavingExpense: false,
		onSave: fn(),
		onCancel: fn(),
	},
	decorators: [
		makeStoreDecorator((state) => {
			state.categories.categories = [
				{ id: 1, name: "Food" },
				{ id: 2, name: "Tech" },
			];
		}),
	],
} satisfies Meta<typeof ExpenseEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const newExpense: Story = {};

export const newExpenseWithDefaultCategory: Story = {
	args: { defaultCategoryId: 2 },
};

export const existing: Story = {
	args: {
		existingExpense: {
			id: 1,
			year: 2024,
			categoryId: 2,
			name: "Internet",
			amount: 100,
			monthsInterval: 1,
			isDistributed: false,
		},
	},
};

export const distributed: Story = {
	args: {
		existingExpense: {
			id: 1,
			year: 2024,
			categoryId: 2,
			name: "Cash Budget",
			amount: 2000,
			monthsInterval: 12,
			isDistributed: true,
		},
	},
};

export const mustRemainDistributed: Story = {
	args: {
		existingExpense: {
			id: 1,
			year: 2024,
			categoryId: 2,
			name: "Cash Budget",
			amount: 2000,
			monthsInterval: 12,
			isDistributed: true,
		},
		mustRemainYearlyExpense: true,
	},
};

export const saving: Story = { args: { isSavingExpense: true } };
