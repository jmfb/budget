import { Meta, StoryObj } from "@storybook/react";
import { CategoryModal } from "./CategoryModal";
import { fn } from "@storybook/test";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: CategoryModal,
	args: {
		existingCategory: null,
		isSaving: false,
		onSave: fn(),
		onCancel: fn(),
	},
	decorators: [
		makeStoreDecorator((state) => {
			state.categories.categories = [
				{ id: 1, name: "Groceries" },
				{ id: 2, name: "Utilities" },
				{ id: 3, name: "Entertainment" },
			];
		}),
	],
} satisfies Meta<typeof CategoryModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const newCategory: Story = {};

export const existing: Story = {
	args: {
		existingCategory: {
			id: 1,
			name: "Groceries",
		},
	},
};
