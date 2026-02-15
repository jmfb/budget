import { Meta, StoryObj } from "@storybook/react";
import { HorizontalLayout } from "./HorizontalLayout";
import { Pill } from "~/components";
import { Button } from "@mui/material";

const meta = {
	component: HorizontalLayout,
	args: {
		children: (
			<>
				<h1>Headline</h1>
				<Pill type="success">Status</Pill>
				<Button variant="contained" color="primary">Click Me</Button>
			</>
		),
	},
} satisfies Meta<typeof HorizontalLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const verticalTop: Story = { args: { verticalAlign: "top" } };

export const verticalCenter: Story = { args: { verticalAlign: "center" } };

export const verticalBottom: Story = { args: { verticalAlign: "bottom" } };

export const horizontalLeft: Story = { args: { horizontalAlign: "left" } };

export const horizontalCenter: Story = { args: { horizontalAlign: "center" } };

export const horizontalRight: Story = { args: { horizontalAlign: "right" } };

export const horizontalJustified: Story = {
	args: { horizontalAlign: "justified" },
};

export const noGap: Story = { args: { gap: "none" } };

export const narrowGap: Story = { args: { gap: "narrow" } };

export const smallGap: Story = { args: { gap: "small" } };

export const wideGap: Story = { args: { gap: "wide" } };

export const fullWidth: Story = { args: { fullWidth: true } };

export const customHeight: Story = { args: { height: "250px" } };

export const customWidth: Story = { args: { width: "100%" } };
