import { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "@mui/material";
import { fn } from "@storybook/test";

const meta = {
	component: Modal,
	args: {
		title: "Edit something",
		children: (
			<div>
				<div>Some content</div>
				<div>Some more</div>
				<div>Some slightly longer content to give depth</div>
			</div>
		),
		buttons: (
			<>
				<Button variant="outlined" color="primary">Cancel</Button>
				<Button variant="contained" color="primary">Save</Button>
			</>
		),
		onClose: fn(),
	},
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const withDelete: Story = {
	args: { deleteButton: <Button variant="contained" color="error">Delete</Button> },
};

export const noTitle: Story = { args: { title: null } };
