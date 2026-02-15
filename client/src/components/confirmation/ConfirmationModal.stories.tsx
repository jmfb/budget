import { Meta, StoryObj } from "@storybook/react";
import { ConfirmationModal } from "./ConfirmationModal";
import { fn } from "@storybook/test";
import { Delete } from "@mui/icons-material";

const meta = {
	component: ConfirmationModal,
	args: {
		header: "Confirmation",
		message: "Are you sure?",
		variant: "primary",
		isLoading: false,
		hasError: false,
		cancelIcon: undefined,
		cancelText: undefined,
		confirmIcon: undefined,
		confirmText: undefined,
		onCancel: fn(),
		onConfirm: fn(),
	},
} satisfies Meta<typeof ConfirmationModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
export const danger: Story = {
	args: {
		variant: "error",
		confirmIcon: Delete,
		confirmText: "Delete",
	},
};
