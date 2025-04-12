import { Meta, StoryObj } from "@storybook/react";
import { Categories } from "./Categories";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: Categories,
	decorators: [
		makeStoreDecorator((state) => {
			state.categories.categories = [
				{ id: 1, name: "Groceries" },
				{ id: 2, name: "Utilities" },
				{ id: 3, name: "Entertainment" },
				{ id: 4, name: "Transportation" },
				{ id: 5, name: "Health" },
				{ id: 6, name: "Other" },
			];
		}),
	],
} satisfies Meta<typeof Categories>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
