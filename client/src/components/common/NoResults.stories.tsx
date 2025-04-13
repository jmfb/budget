import { Meta, StoryObj } from "@storybook/react";
import { NoResults } from "./NoResults";

const meta = {
	component: NoResults,
	args: {
		children: "No transactions matched your search.",
	},
} satisfies Meta<typeof NoResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
