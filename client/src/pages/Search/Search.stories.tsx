import { Meta, StoryObj } from "@storybook/react";
import { Search } from "./Search";
import { fn } from "@storybook/test";
import { useState } from "react";
import { ITransaction } from "~/models";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: Search,
	render(props) {
		const [searchQuery, setSearchQuery] = useState(props.searchQuery);
		return (
			<Search
				{...props}
				searchQuery={searchQuery}
				onUpdateSearch={setSearchQuery}
			/>
		);
	},
	args: {
		searchQuery: "",
		isLoading: false,
		categoryById: {},
		incomeById: {},
		expenseById: {},
		expenseTransactions: {},
		transactions: [],
		onUpdateSearch: fn(),
	},
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const loading: Story = { args: { isLoading: true } };

export const noResults: Story = { args: { searchQuery: "foo" } };

export const match: Story = {
	args: {
		searchQuery: "foo",
		transactions: [
			{
				id: 1,
				date: "2025-03-25",
				note: "Foo",
				description: "Costco",
				amount: 1234.56,
				categoryId: null,
				expenseId: null,
				incomeId: null,
			},
			{
				id: 2,
				date: "2025-03-24",
				note: "Bar",
				description: "Pick n Save",
				amount: 200,
				categoryId: null,
				expenseId: null,
				incomeId: null,
			},
			{
				id: 3,
				date: "2025-03-24",
				note: "Baz",
				description: "Gas",
				amount: 50,
				categoryId: null,
				expenseId: null,
				incomeId: null,
			},
		] as ITransaction[],
	},
};
