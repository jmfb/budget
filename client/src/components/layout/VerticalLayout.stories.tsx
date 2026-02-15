import { Meta, StoryObj } from "@storybook/react";
import { VerticalLayout } from "./VerticalLayout";
import { Button, TextField } from "@mui/material";

const meta = {
	component: VerticalLayout,
	args: {
		children: (
			<>
				<h1>Headline</h1>
				<TextField
					label="Test Input"
					variant="standard"
					value="This is an input"
					onChange={() => undefined}
				/>
				<Button variant="contained" color="primary">
					Click Me
				</Button>
			</>
		),
	},
} satisfies Meta<typeof VerticalLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const verticalTop: Story = { args: { verticalAlign: "top" } };

export const verticalCenter: Story = { args: { verticalAlign: "center" } };

export const verticalBottom: Story = { args: { verticalAlign: "bottom" } };

export const horizontalLeft: Story = { args: { horizontalAlign: "left" } };

export const horizontalCenter: Story = { args: { horizontalAlign: "center" } };

export const horizontalRight: Story = { args: { horizontalAlign: "right" } };

export const noGap: Story = { args: { gap: "none" } };

export const narrowGap: Story = { args: { gap: "narrow" } };

export const smallGap: Story = { args: { gap: "small" } };

export const wideGap: Story = { args: { gap: "wide" } };

export const customWidth: Story = { args: { width: "250px" } };
