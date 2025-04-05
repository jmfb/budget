import { Meta, StoryObj } from "@storybook/react";
import { ErrorView } from "./ErrorView";
import { fn } from "@storybook/test";

const meta = {
	component: ErrorView,
	args: {
		onClickDismiss: fn(),
	},
} satisfies Meta<typeof ErrorView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {
	args: { action: "Example Action", message: "This is an error message" },
};

export const WithContext: Story = {
	args: {
		action: "Example Action",
		message: "This is an error message",
		context:
			"This is some context about the error\n" +
			"That can be multiple lines\n" +
			"And is usually a fixed width.",
	},
};
